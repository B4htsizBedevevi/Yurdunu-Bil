-- Yurdunu Bil: harden sensitive RPC entry points.
-- Keep Arena/learning SECURITY DEFINER functions callable by signed-in users,
-- but do not expose answer/learning-write RPCs to anonymous clients.

revoke execute on function public.arena_submit_answer(uuid, uuid, integer, integer, integer, boolean, integer) from anon;
revoke execute on function public.record_learning_answer(text, boolean, text, integer) from anon;

grant execute on function public.arena_submit_answer(uuid, uuid, integer, integer, integer, boolean, integer) to authenticated;
grant execute on function public.record_learning_answer(text, boolean, text, integer) to authenticated;
