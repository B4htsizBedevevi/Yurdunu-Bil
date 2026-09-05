create table if not exists public.learning_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  attempts integer not null default 0 check (attempts >= 0),
  correct integer not null default 0 check (correct >= 0 and correct <= attempts),
  mastery numeric(5,2) not null default 0 check (mastery >= 0 and mastery <= 100),
  ease numeric(4,2) not null default 2.50 check (ease >= 1.30 and ease <= 4.00),
  interval_days integer not null default 0 check (interval_days >= 0 and interval_days <= 365),
  due_at timestamptz not null default now(),
  last_seen_at timestamptz,
  last_correct_at timestamptz,
  wrong_streak integer not null default 0 check (wrong_streak >= 0),
  correct_streak integer not null default 0 check (correct_streak >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);
create index if not exists learning_mastery_due_idx on public.learning_mastery(user_id,due_at);
create index if not exists learning_mastery_topic_idx on public.learning_mastery(topic_id,mastery);
alter table public.learning_mastery enable row level security;
create policy learning_mastery_select on public.learning_mastery for select to authenticated using ((select auth.uid())=user_id);
create policy learning_mastery_insert on public.learning_mastery for insert to authenticated with check ((select auth.uid())=user_id);
create policy learning_mastery_update on public.learning_mastery for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update on public.learning_mastery to authenticated;

create or replace function public.record_learning_answer(p_topic_id text,p_correct boolean,p_source_id text default null,p_difficulty integer default 2) returns jsonb language plpgsql security definer set search_path=public,pg_catalog as $$
declare uid uuid := (select auth.uid()); m public.learning_mastery; new_mastery numeric; new_interval integer; new_ease numeric; xp integer;
begin
if uid is null then raise exception 'not_authenticated'; end if;
if p_topic_id is null or length(btrim(p_topic_id))=0 then raise exception 'invalid_topic'; end if;
if p_difficulty < 1 or p_difficulty > 5 then raise exception 'invalid_difficulty'; end if;
insert into public.learning_mastery(user_id,topic_id) values(uid,btrim(p_topic_id)) on conflict do nothing;
select * into m from public.learning_mastery where user_id=uid and topic_id=btrim(p_topic_id) for update;
new_mastery:=greatest(0,least(100,round((m.mastery*0.78+(case when p_correct then 100 else 0 end)*0.22)::numeric,2)));
new_ease:=greatest(1.30,least(4.00,m.ease+case when p_correct then 0.05 else -0.12 end));
new_interval:=case when p_correct then (case when m.interval_days<=0 then 1 else least(365,greatest(1,round(m.interval_days*new_ease)::integer)) end) else 0 end;
xp:=case when p_correct then 10+greatest(0,least(4,p_difficulty-1))*3 else 2 end;
update public.learning_mastery set attempts=attempts+1,correct=correct+(case when p_correct then 1 else 0 end),mastery=new_mastery,ease=new_ease,interval_days=new_interval,due_at=case when p_correct then now()+make_interval(days=>new_interval) else now()+interval '6 hours' end,last_seen_at=now(),last_correct_at=case when p_correct then now() else last_correct_at end,wrong_streak=case when p_correct then 0 else wrong_streak+1 end,correct_streak=case when p_correct then correct_streak+1 else 0 end,updated_at=now() where user_id=uid and topic_id=btrim(p_topic_id);
insert into public.learning_events(user_id,event_type,source_id,xp_delta,correct,metadata) values(uid,'answer',p_source_id,xp,p_correct,jsonb_build_object('topic_id',p_topic_id,'difficulty',p_difficulty));
insert into public.learning_stats(user_id,xp,total_questions,total_correct,current_streak,best_streak,level,last_activity_at,updated_at) values(uid,xp,1,case when p_correct then 1 else 0 end,case when p_correct then 1 else 0 end,case when p_correct then 1 else 0 end,1,now(),now()) on conflict(user_id) do update set xp=public.learning_stats.xp+excluded.xp,total_questions=public.learning_stats.total_questions+1,total_correct=public.learning_stats.total_correct+excluded.total_correct,current_streak=case when excluded.total_correct=1 then public.learning_stats.current_streak+1 else 0 end,best_streak=greatest(public.learning_stats.best_streak,case when excluded.total_correct=1 then public.learning_stats.current_streak+1 else 0 end),last_activity_at=now(),updated_at=now();
return jsonb_build_object('topic_id',p_topic_id,'mastery',new_mastery,'interval_days',new_interval,'xp',xp);
end; $$;
revoke all on function public.record_learning_answer(text,boolean,text,integer) from public;
grant execute on function public.record_learning_answer(text,boolean,text,integer) to authenticated;

create or replace function public.get_learning_dashboard() returns jsonb language sql security definer set search_path=public,pg_catalog as $$
with mm as (select topic_id,round(mastery,0) as mastery,attempts,correct,due_at,wrong_streak from public.learning_mastery where user_id=(select auth.uid())),due as (select count(*) n from mm where due_at<=now()),weak as (select coalesce(jsonb_agg(to_jsonb(x) order by x.mastery asc),'[]'::jsonb) j from (select * from mm order by mastery asc,wrong_streak desc limit 5)x),allm as (select coalesce(jsonb_agg(to_jsonb(mm) order by mm.mastery desc),'[]'::jsonb) j from mm) select jsonb_build_object('mastery',(select j from allm),'due_count',(select n from due),'weak_topics',(select j from weak),'stats',(select to_jsonb(s) from public.learning_stats s where s.user_id=(select auth.uid())));
$$;
revoke all on function public.get_learning_dashboard() from public;
grant execute on function public.get_learning_dashboard() to authenticated;