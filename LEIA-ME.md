# Portfólio Julia Milreu — guia

Site de motion design, leve e rápido, com painel visual para você adicionar projetos sozinha.
Tudo de graça. Nenhuma mensalidade.

## O que tem aqui

```
site/
├── index.html        → página inicial (hero + grid de projetos)
├── about.html        → página sobre
├── styles.css        → estilo (cores, fontes, layout)
├── script.js         → carrega os projetos e abre os vídeos
├── projects.json     → seus projetos (editado pelo painel)
├── site.json         → textos e contatos (editado pelo painel)
└── admin/            → o PAINEL VISUAL
    ├── index.html
    └── config.yml
```

Seus **16 vídeos do Vimeo** já estão dentro, com capa e título. Os vídeos abrem num
player sobreposto (lightbox) quando você clica no card.

---

## 1. Publicar o site (grátis, ~10 min)

Para o **painel visual funcionar**, o caminho é GitHub + Netlify. Os dois são gratuitos.

### Passo a passo
1. Crie uma conta no **GitHub** (github.com) e uma no **Netlify** (netlify.com).
   *(Eu não posso criar contas por você — mas é só e-mail e senha.)*
2. No GitHub, crie um repositório novo (ex.: `portfolio`) e suba a pasta `site/`.
   Se preferir, me avise que eu te passo os comandos exatos.
3. No Netlify: **Add new site → Import from GitHub** → escolha o repositório.
   - Build command: deixe vazio
   - Publish directory: `/` (ou o nome da pasta, se você subiu dentro de uma)
4. Pronto — o Netlify te dá um endereço tipo `seunome.netlify.app`. O site já está no ar.

> Atalho só para testar (sem painel): em app.netlify.com você pode **arrastar a pasta
> `site/`** direto para a área "Deploy". Sobe na hora, mas o painel `/admin` só funciona
> pelo caminho do GitHub acima.

---

## 2. Ligar o painel visual (`seusite.com/admin`)

O painel usa o **Netlify Identity** (login) + **Git Gateway** (salva as mudanças).

1. No Netlify, no seu site: **Integrations / Identity → Enable Identity**.
2. Em **Identity → Services → Git Gateway → Enable**.
3. Em **Identity → Invite users**, convide seu próprio e-mail (juliamilreu@gmail.com).
   Você recebe um e-mail, cria uma senha e pronto.
4. Acesse `seusite.com/admin`, faça login, e você verá:
   - **Portfólio → Projetos**: adicionar, editar, reordenar e remover vídeos.
   - **Configurações do site**: mudar o texto do topo, o "sobre" e os contatos.

### Como adicionar um projeto novo
No painel, em **Projetos → adicionar**, preencha:
- **Título** do trabalho
- **ID do vídeo no Vimeo** → só o número. Em `vimeo.com/719671885`, o ID é `719671885`.
- **Categoria** (Mobile Games / Eventos / Social) — opcional
- **Capa** — pode deixar em branco que ele usa a capa do Vimeo automaticamente

Clique em **Publish**. Em ~1 min o site atualiza sozinho. Sem mexer em código.

---

## 3. Conectar o domínio `juliamilreu.com`

Esse domínio hoje está com o Wix. Duas opções:

**A) Apontar o domínio para o site novo (mantém o registro no Wix/onde está)**
1. No Netlify: **Domain settings → Add custom domain** → digite `juliamilreu.com`.
2. O Netlify mostra os registros de DNS (tipo `A` e `CNAME`).
3. No painel onde o domínio está registrado, troque os registros pelos do Netlify.
4. Em algumas horas o `juliamilreu.com` passa a abrir o site novo. HTTPS é automático.

**B) Transferir o registro do domínio** para outro provedor (ex.: Registro.br, Cloudflare)
— mais passos, só vale se você quiser sair totalmente do Wix.

> A **compra/renovação** do domínio (a parte de pagamento) precisa ser feita por você.
> O resto da configuração eu te ajudo a fazer, passo a passo.

Quando chegar nessa etapa, me chama que eu te guio com base no provedor exato do seu domínio.

---

## Quer ajustar o visual?
As cores e fontes estão no topo do `styles.css` (bloco `:root`). Me diga o que quer mudar
(fundo escuro, outra fonte, cards quadrados como no Wix, etc.) que eu ajusto pra você.
