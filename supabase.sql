create table chat_logs (
  id bigserial primary key,
  created_at timestamptz default now(),
  channel text,
  session text,
  language text,
  question text,
  answer text,
  sources text,
  status text
);

create table feedback (
  id bigserial primary key,
  created_at timestamptz default now(),
  channel text,
  session text,
  vote text,
  question text
);

-- Block public access; n8n uses the service_role key, which still works
alter table chat_logs enable row level security;
alter table feedback enable row level security;

select created_at, channel, language, status, question from chat_logs order by id desc;
select * from feedback order by id desc;

-- Move values from the misspelled keys to the correct ones
update documents
set metadata = (metadata - 'language ' - 'effective_date  ')
  || jsonb_build_object(
       'language', metadata->>'language ',
       'effective_date', metadata->>'effective_date  ')
where metadata ? 'language ' or metadata ? 'effective_date  ';

-- See which PDF sources have no name
select distinct metadata->>'source_url' as url, metadata->>'scheme_name' as scheme
from documents
where coalesce(metadata->>'source_name', '') = '';


update documents
set metadata = metadata || '{"source_name": "LHDN – Tax reliefs (individual)"}'
where metadata->>'source_url' = 'PASTE_THE_URL_HERE';