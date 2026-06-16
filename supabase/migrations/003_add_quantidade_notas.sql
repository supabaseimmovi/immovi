-- Adiciona campo para quantidade de notas fiscais emitidas por mês
-- Preenchido apenas quando emite_nota = 'sim'
alter table leads_immovi
  add column if not exists quantidade_notas integer check (quantidade_notas > 0 and quantidade_notas <= 9999);
