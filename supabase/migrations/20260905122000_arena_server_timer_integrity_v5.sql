begin;

drop function if exists public.arena_submit_answer(uuid,uuid,integer,integer,boolean,integer,integer);
create function public.arena_submit_answer(
  p_match_id uuid,
  p_player_id uuid,
  p_question_index integer,
  p_answer_index integer,
  p_is_correct boolean,
  p_response_ms integer,
  p_points integer
) returns jsonb
language plpgsql security definer
set search_path = public, pg_catalog
as $$
declare v_uid uuid := (select auth.uid()); v_correct integer; v_ok boolean; v_ms integer; v_pts integer; v_started timestamptz; v_round integer; v_status text;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  if p_player_id <> v_uid then raise exception 'player mismatch'; end if;
  if not public.guard_rate_limit('arena_answer',180,60) then raise exception 'rate limit exceeded'; end if;
  if p_question_index not between 0 and 100 or p_answer_index not between 0 and 20 then raise exception 'invalid answer'; end if;
  select status,current_round,question_started_at into v_status,v_round,v_started from public.arena_matches where id=p_match_id and (host_id=v_uid or guest_id=v_uid) for update;
  if not found then raise exception 'match unavailable'; end if;
  if v_status <> 'active' then raise exception 'match not active'; end if;
  if p_question_index <> v_round then raise exception 'invalid question round'; end if;
  if v_started is null then raise exception 'question timer unavailable'; end if;
  if exists(select 1 from public.arena_answers where match_id=p_match_id and player_id=v_uid and question_index=p_question_index) then return jsonb_build_object('duplicate',true,'points',0); end if;
  select aq.correct_index into v_correct from public.arena_match_questions mq join public.arena_question_bank aq on aq.id=mq.question_id where mq.match_id=p_match_id and mq.question_index=p_question_index and aq.active limit 1;
  if v_correct is null then raise exception 'question not available'; end if;
  v_ok := p_answer_index=v_correct;
  v_ms := least(120000,greatest(0,extract(epoch from (clock_timestamp()-v_started))*1000)::integer);
  v_pts := case when v_ok then greatest(0,1000-floor(v_ms/100)::integer) else 0 end;
  insert into public.arena_answers(match_id,player_id,question_index,answer_index,is_correct,response_ms,points) values(p_match_id,v_uid,p_question_index,p_answer_index,v_ok,v_ms,v_pts);
  update public.arena_matches set last_activity_at=clock_timestamp() where id=p_match_id;
  return jsonb_build_object('duplicate',false,'is_correct',v_ok,'points',v_pts,'response_ms',v_ms);
end;
$$;
revoke execute on function public.arena_submit_answer(uuid,uuid,integer,integer,boolean,integer,integer) from anon;
grant execute on function public.arena_submit_answer(uuid,uuid,integer,integer,boolean,integer,integer) to authenticated;
commit;
