-- Yurdunu Bil production lifecycle hardening v4
-- Applied to production project rdgefzwvfqvzmpfoiprj.
-- Keep browser access limited to authenticated API RPCs.

revoke execute on function public.arena_submit_answer(uuid,uuid,integer,integer,boolean,integer,integer) from anon;
revoke execute on function public.record_learning_answer(text,boolean,text,integer) from anon;
revoke all on table public.api_rate_limits from anon, authenticated;
revoke all on table public.learning_answer_dedup from anon, authenticated;
revoke execute on function public.guard_rate_limit(text,integer,integer) from anon, authenticated;
grant execute on function public.arena_submit_answer(uuid,uuid,integer,integer,boolean,integer,integer) to authenticated;
grant execute on function public.record_learning_answer(text,boolean,text,integer) to authenticated;
grant execute on function public.cleanup_rate_limits() to service_role;
grant execute on function public.cleanup_learning_dedup() to service_role;
grant execute on function public.cleanup_stale_arena() to service_role;
grant execute on function public.cleanup_old_learning_events() to service_role;
