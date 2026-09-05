-- Arena topic integrity v2
-- Prevents topic-specific matchmaking from silently falling back to another topic.
-- Also keeps the waiting-room lookup fast as the Arena grows.

create index if not exists arena_matches_waiting_lookup_idx
  on public.arena_matches(mode, status, topic, created_at);

create or replace function public.arena_create_match(
  p_mode text default 'duel',
  p_topic text default null,
  p_question_count integer default 10
) returns public.arena_matches
language plpgsql
security definer
set search_path to 'public','pg_catalog'
as $function$
declare
  m public.arena_matches;
  n text;
  g text;
  s jsonb;
  requested_count integer;
  available_count integer;
  selected_topic text;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  -- Expired waiting rooms should never remain in the matchmaking pool.
  delete from public.arena_matches
  where status='waiting' and expires_at < now();

  selected_topic := nullif(trim(p_topic), '');
  requested_count := least(greatest(coalesce(p_question_count,10),1),20);

  if selected_topic is null then
    select count(*) into available_count
    from public.arena_question_bank
    where active;
  else
    select count(*) into available_count
    from public.arena_question_bank
    where active and topic=selected_topic;
  end if;

  if available_count < 1 then
    raise exception 'no_questions_for_topic';
  end if;

  -- Never replace a requested topic with random questions from another topic.
  requested_count := least(requested_count, available_count);

  g := coalesce((select game_type from public.arena_game_preferences where user_id=auth.uid()),'ten');
  s := coalesce((select settings from public.arena_game_preferences where user_id=auth.uid()),'{}'::jsonb);
  n := coalesce(
    (select raw_user_meta_data->>'display_name' from auth.users where id=auth.uid()),
    (select raw_user_meta_data->>'full_name' from auth.users where id=auth.uid()),
    'Oyuncu'
  );

  perform public.arena_sync_profile(n);
  insert into public.arena_ratings(user_id)
  values(auth.uid()) on conflict(user_id) do nothing;

  insert into public.arena_matches(
    code,mode,topic,question_count,created_by,game_type,game_settings,expires_at
  ) values(
    public.arena_make_code(),
    coalesce(nullif(p_mode,''),'duel'),
    selected_topic,
    requested_count,
    auth.uid(),
    g,
    s,
    now()+interval '30 minutes'
  ) returning * into m;

  insert into public.arena_players(match_id,user_id,display_name,rating)
  values(
    m.id,
    auth.uid(),
    n,
    coalesce((select rating from public.arena_ratings where user_id=auth.uid()),1000)
  );

  insert into public.arena_match_questions(match_id,question_index,question_id)
  select m.id,row_number() over(order by random())-1,id
  from public.arena_question_bank
  where active and (selected_topic is null or topic=selected_topic)
  order by random()
  limit requested_count;

  return m;
end;
$function$;

revoke all on function public.arena_create_match(text,text,integer) from public;
grant execute on function public.arena_create_match(text,text,integer) to authenticated;
