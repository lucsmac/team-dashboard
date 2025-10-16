# Deploy Rápido no Render

## TL;DR - 5 Passos

```bash
# 1. Commit tudo
git add .
git commit -m "feat: add Render deployment config"
git push origin main

# 2. Acesse render.com
# 3. New+ → Blueprint
# 4. Conecte o repositório GitHub
# 5. Apply (aguarde 10-15min)
```

Pronto! Seu app estará em:
- **Frontend**: `https://team-report-frontend.onrender.com`
- **Backend**: `https://team-report-backend.onrender.com`

## O que o Render vai criar?

1. **PostgreSQL** (sempre ativo, 1GB)
2. **Backend Node.js** (dorme após 15min)
3. **Frontend React** (sempre ativo)

## Primeira requisição pode demorar

O backend no free tier "dorme" após 15min de inatividade. A primeira requisição pode levar até 30 segundos.

## Custo

**$0/mês** - Completamente grátis!

## Próximos passos

- Leia `DEPLOY_RENDER.md` para detalhes completos
- Configure domínio customizado (opcional)
- Adicione secrets/env vars adicionais se necessário

## Problemas?

**CORS error**: Aguarde o backend terminar o deploy completamente

**Build failed**: Verifique logs no dashboard do Render

**Lento**: Primeira requisição é sempre lenta (cold start)

---

Dúvidas? Veja a documentação completa em `DEPLOY_RENDER.md`
