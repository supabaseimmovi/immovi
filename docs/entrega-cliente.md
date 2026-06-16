*🌐 Site:* https://immovi.vercel.app

*🔐 CRM:* https://immovi.vercel.app/login
*Login:* fornecido por canal seguro
*Senha:* fornecida por canal seguro e alterada no primeiro acesso

---

*🛡️ Proteções implementadas*

*Formulário e Caixinha do WhatsApp*
- Verificação automática que identifica se quem está enviando é uma pessoa real ou um robô — robôs são bloqueados antes mesmo de chegar ao banco de dados
- Limite de envios por minuto para evitar que alguém tente sobrecarregar o sistema
- Todos os campos são conferidos duas vezes antes de salvar — uma vez na tela e outra vez no servidor

*Área do CRM*
- Acesso protegido por usuário e senha — sem login válido, a página não abre
- A sessão expira automaticamente após 8 horas por segurança
- As senhas são armazenadas de forma criptografada — mesmo que alguém acesse o banco de dados, não consegue ler as senhas
- Somente o administrador pode excluir leads

*Banco de dados*
- Os leads enviados pelo site ficam protegidos — ninguém de fora consegue ler, editar ou apagar os dados, apenas enviar uma nova solicitação
- As chaves de acesso ao banco nunca ficam visíveis para quem acessa o site
