# :checkered_flag: AlugAqui

Sistema de divulgação de imóveis para aluguel, funcionando de forma semelhante a um marketplace ou fórum. Usuários poderão publicar anúncios de imóveis disponíveis para aluguel ou divulgar oportunidades encontradas. A aplicação terá como objetivo facilitar a divulgação e a busca por imóveis, sem realizar transações comerciais diretamente pela plataforma.

## :technologist: Membros da equipe

* João Pedro Teófilo da Silva - 579298
* Francisco Tiago De Souza Liberato - 581897
* Marcos Vinícius de Morais - 582197
* Douglas Teófilo Cavalcante da Silva - 564625

## :bulb: Objetivo Geral

Criar uma plataforma simples e aberta para divulgação e busca de imóveis disponíveis para aluguel, facilitando o contato entre pessoas que possuem ou encontraram imóveis disponíveis e pessoas interessadas em alugá-los.

## :eyes: Público-Alvo

Pessoas que procuram imóveis para alugar, especialmente estudantes, moradores de cidades universitárias e comerciantes em busca de espaços para estabelecimentos comerciais, além de pessoas que possuem imóveis disponíveis para aluguel ou desejam divulgar oportunidades encontradas.

## :handshake: Relação com a Extensão Universitária

O AlugAqui busca atender a uma necessidade de estudantes e moradores de Quixadá que procuram imóveis para aluguel e de pessoas da região que desejam divulgar imóveis disponíveis. Atualmente, essas informações podem estar dispersas em grupos de mensagens, redes sociais e indicações pessoais.

A proposta é desenvolver uma plataforma que facilite o acesso a essas oportunidades e aproxime a comunidade universitária dos moradores locais. Para isso, o desenvolvimento poderá contar com a participação de estudantes que procuram moradia e de proprietários ou anunciantes da região, cujas experiências e necessidades ajudarão a orientar as funcionalidades do sistema.

## :star2: Impacto Esperado

Facilitar o acesso a informações sobre imóveis disponíveis para aluguel, especialmente para estudantes que chegam a Quixadá e precisam encontrar moradia, além de moradores e comerciantes que procuram espaços para alugar.

Ao reunir anúncios em um único ambiente, o AlugAqui poderá reduzir a dificuldade de encontrar oportunidades e ampliar a visibilidade dos imóveis divulgados por pequenos proprietários. Espera-se também diminuir a dependência de informações dispersas em grupos de mensagens e indicações pessoais, contribuindo para aproximar pessoas que procuram imóveis daquelas que desejam disponibilizá-los.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

**Usuário não logado:** pode acessar a aplicação, visualizar listagens, buscar por palavras-chave, aplicar filtros avançados e visualizar os detalhes completos dos anúncios e suas galerias de fotos.

**Usuário logado:** além das funcionalidades de navegação, pode criar anúncios, associar múltiplas imagens, alterar status dos anúncios (Ativo/Alugado/Pausado), salvar imóveis em uma lista de favoritos, comentar em anúncios de outros usuários, denunciar conteúdos inadequados e gerenciar seu perfil.

**Administrador:** possui todas as funcionalidades do usuário logado, além de acesso ao painel de moderação para gerenciar a fila de denúncias, remover anúncios ou comentários inadequados e controlar o status das contas de usuários.

## :triangular_flag_on_post: Principais funcionalidades da aplicação

**Acessíveis a todos os usuários:**

* Visualizar listagem de anúncios de imóveis disponíveis;
* Buscar anúncios por palavras-chave (título, descrição, bairro);
* Filtrar anúncios por critérios avançados (faixa de preço, tipo de imóvel, quantidade de quartos/banheiros, aceita pets, mobiliado);
* Ordenar anúncios por preço (menor/maior) e por data de publicação mais recente;
* Visualizar detalhes completos do anúncio e galeria de imagens.

**Restritas a usuários logados:**

* Criar, editar e remover seus próprios anúncios;
* Alterar o status do anúncio (Ativo / Alugado / Pausado);
* Fazer upload de múltiplas imagens por anúncio;
* Salvar anúncios em uma lista pessoal de "Favoritos";
* Comentar e tirar dúvidas em anúncios de outros usuários;
* Denunciar anúncios ou comentários suspeitos e inadequados;
* Gerenciar o próprio perfil e atualizar dados cadastrais.

**Restritas a administradores:**

* Central/Painel de Moderação para análise de denúncias recebidas;
* Remover ou ocultar anúncios e comentários inadequados;
* Gerenciar contas de usuários (ativar ou suspender acesso);
* Visualizar painel com métricas gerais da aplicação (total de anúncios ativos, usuários e denúncias pendentes).

## :spiral_calendar: Entidades ou tabelas do sistema

* **Usuário:** armazena os dados cadastrais dos usuários, credenciais e seu nível de acesso na plataforma (`nome`, `email`, `senha`, `telefone`, `papel_acesso`, `status_conta`, `data_criacao`);
* **Imóvel:** armazena as características físicas do imóvel (`tipo_imovel`, `bairro`, `rua`, `numero`, `cep`, `cidade`, `qtd_quartos`, `qtd_banheiros`, `aceita_pets`, `mobiliado`);
* **Anúncio:** representa a publicação do imóvel para aluguel e seus termos (`titulo`, `descricao`, `preco`, `status`, `data_criacao`, `usuario_id`, `imovel_id`);
* **ImagemAnuncio:** armazena os links e a ordem das mídias associadas ao anúncio (`url_imagem`, `is_capa`, `ordem`, `anuncio_id`);
* **Comentário:** armazena interações e dúvidas enviadas pelos usuários nos anúncios (`texto`, `data_criacao`, `usuario_id`, `anuncio_id`);
* **Favorito:** tabela associativa para que usuários possam guardar seus anúncios prediletos (`usuario_id`, `anuncio_id`, `data_criacao`);
* **Denúncia:** armazena reportes efetuados pelos usuários para suporte à moderação (`motivo`, `status`, `denunciante_id`, `anuncio_id`, `comentario_id`, `data_criacao`).
