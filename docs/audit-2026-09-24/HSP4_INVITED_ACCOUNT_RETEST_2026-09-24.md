# HSP-4 — reteste do login convidado (2026-09-24)

**Estado: PASS do novo login do convidado, com escopo delimitado.** O proprietário tentou primeiro entrar após sair da sessão do convite e recebeu a mensagem genérica de falha. Ele informou que digitou o Gmail principal, enquanto o convite mais recente e a senha criada naquele fluxo pertencem ao endereço com sufixo `+` usado para o ensaio HSP-4. Uma inspeção somente leitura de Auth encontrou duas contas distintas, ambas confirmadas e com vínculo `member`; nenhuma estava banida. O resultado dessa primeira tentativa não demonstrava defeito no fluxo da conta convidada mais recente.

Em seguida, o proprietário entrou no staging com o **endereço completo que recebeu o último convite**, incluindo o sufixo, e informou que abriu **somente Tenant A**. Uma nova leitura Auth mostrou `last_sign_in_at` da conta convidada posterior ao pedido de reteste, enquanto o da conta Gmail principal não mudou nessa janela; a conta convidada tem um único vínculo `member`. Nenhuma senha, token, hash, identificador de usuário ou link de recuperação foi solicitado ou registrado. Isso corrobora novo login por senha e vínculo esperado, somado à confirmação do operador. A negativa da área administrativa a esse membro e a prova cross-tenant multi-role foram observadas em ensaios hospedados anteriores; não foram repetidas durante esta interação humana.

## Correção candidata local

A tela de entrada agora orienta o convidado a usar o endereço completo do destinatário e recupera a interface caso a chamada de Auth falhe por rede, sem revelar se uma conta existe. Validação local: 9 testes focados PASS, TypeScript PASS, lint focado PASS e verificação de integridade PASS. A correção **não foi implantada** no SHA hospedado `bb290bc7bc35f77b4ca01aecdbf19b748c386270` e não recebe crédito de runtime.

O primeiro erro era compatível com a escolha da conta Gmail principal, não com falha comprovada de Auth. Para uma futura recuperação, usar o endereço exato da conta desejada; não reutilizar o link de convite consumido nem redefinir senha sem o proprietário.
