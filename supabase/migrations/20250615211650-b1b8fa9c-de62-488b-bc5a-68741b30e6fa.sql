
-- Krok 1: Tworzymy funkcję, która będzie wywoływana przy każdej nowej wiadomości FUKO.
-- Ta funkcja wywoła naszą nową logikę backendową (Edge Function).
create or replace function public.handle_new_fuko_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Przetwarzamy wiadomość tylko wtedy, gdy ma status 'pending'.
  if new.status <> 'pending' then
    return new;
  end if;

  -- Asynchronicznie wywołujemy funkcję brzegową 'fuko-processor',
  -- przekazując jej dane nowej wiadomości do przetworzenia.
  perform net.http_post(
    url := 'https://xhhgaysawtaeimxeodfd.supabase.co/functions/v1/fuko-processor',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaGdheXNhd3RhZWlteGVvZGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA4MzQ2NCwiZXhwIjoyMDY0NjU5NDY0fQ.x-LGIMiCHUrlVOPCKWnC2-Bxj_950PDcdqk3BnNEwn8' -- Klucz serwisowy dla autoryzacji
    ),
    body := jsonb_build_object('record', new)
  );

  return new;
end;
$$;

-- Krok 2: Tworzymy wyzwalacz, który uruchomi powyższą funkcję
-- za każdym razem, gdy do tabeli 'fuko_messages' zostanie dodana nowa wiadomość.
create trigger on_fuko_message_inserted
  after insert on public.fuko_messages
  for each row execute procedure public.handle_new_fuko_message();

