# MIND-UML — A arquitetura cognitiva do V1TRUVIO

O UML mental completo: como a mente é composta (classes), como ela gera (sequência), como ela decide rito (estados) e como ela aprende (ciclo de vida). Os diagramas são a especificação — o [CONTRACT.md](../mind/CONTRACT.md) é a implementação em prosa.

---

## 1. Visão geral — o compilador

```mermaid
flowchart LR
    subgraph INPUT
        A["Produto + Operador + Contexto"]
    end
    subgraph MENTE["V1TRUVIO (mente)"]
        B["Diagnóstico<br/>operador · máquina"] --> C["Modo<br/>1 de 8"]
        C --> D["Calibração<br/>6 vetores + travas"]
        D --> E["Órgãos<br/>5 perguntas"]
        E --> F["RAG<br/>3-5 cards → leis"]
        F --> G["Síntese<br/>3 planos + mapa de atrito"]
        G --> H{"GATE<br/>12 itens"}
    end
    subgraph OUTPUT
        I["Design Brief rastreável"] --> J["Sistema visual / tokens"]
        J --> K["PROVA mínima"]
        K --> L["Preset registrado"]
    end
    A --> B
    H -- aprova --> I
    H -- reprova --> G
    L -. memória da mente .-> D
```

**Leitura:** estilo nunca entra; entra produto+operador. O gate devolve para a síntese, não para o lixo. O preset aprovado realimenta calibrações futuras — é o único mecanismo de aprendizado da mente.

---

## 2. Diagrama de classes — a anatomia

```mermaid
classDiagram
    direction TB

    class NucleoFilosofico {
        +fraseMae
        +tese : interface = ambiente operacional
        +inimigo : planicidade anestesiante
        +Lei1_funcao_antes_de_teatro
        +Lei2_friccao_so_com_consequencia
        +Lei3_referencia_como_principio
    }

    class Operador {
        +papel : le|cria|investiga|calibra|autoriza|comanda|arrisca
        +estadoEmocional
        +memoriaGeracional
        +regraDoRecuo() se so consome, interface recua
    }

    class Maquina {
        +oQueProcessa
        +estadosVisiveis[*]
        +estadosOcultos[*]
        +testeHonestidade() telemetria sem fonte = cortada
    }

    class Orgao {
        <<abstract>>
        +inspiracao
        +pergunta()
    }
    class OlhoConstrutivista {
        +pergunta() onde esta o peso da decisao?
    }
    class PeleBrutalista {
        +pergunta() qual e a materia desta maquina?
    }
    class MaoAnalogica {
        +pergunta() onde tocar algo real?
    }
    class CerebroTelemetrista {
        +pergunta() o que visivel gera confianca?
    }
    class MemoriaGeracional {
        +pergunta() que memoria sensorial e familiar a ESTE operador?
    }

    class VetorGerativo {
        +nome
        +valor : 0..10
        +justificativa : obrigatoria
        +travas[*] : bloqueantes
    }

    class Modo {
        +nome : 1 de 8
        +biasDeVetores
        +proibicoes[*] : entram no gate
    }

    class RagCard {
        +leiExtraida
        +usarQuando
        +traduzirEm
        +evitar
        +riscoDeCliche
        +componentesDerivados[*]
        +pareiaBemCom[*]
    }

    class PipelineGerador {
        +passo1_diagnosticoOperador()
        +passo2_diagnosticoMaquina()
        +passo3_modo()
        +passo4_calibracao()
        +passo5_rag()
        +passo6_tresPlanos()
        +passo7_mapaDeAtrito()
        +passo8_sistemaVisual()
        +passo9_prova()
    }

    class GateAntiPadroes {
        +itens[12] : binarios
        +reprova() volta ao passo de origem
    }

    class DesignBrief {
        +secoes[9] : todas obrigatorias
        +rastreabilidade : card|lei|vetor|modo
    }

    class Prova {
        +menorArtefatoQueProvaADirecao
        +julgamento : Max
    }

    class Preset {
        +produto
        +vetores[6]
        +modo
        +cards[3..5]
        +linkProva
    }

    NucleoFilosofico "1" *-- "5" Orgao : percebe por
    Orgao <|-- OlhoConstrutivista
    Orgao <|-- PeleBrutalista
    Orgao <|-- MaoAnalogica
    Orgao <|-- CerebroTelemetrista
    Orgao <|-- MemoriaGeracional

    PipelineGerador --> Operador : diagnostica
    PipelineGerador --> Maquina : diagnostica
    PipelineGerador --> Modo : escolhe 1
    PipelineGerador --> VetorGerativo : calibra 6
    PipelineGerador --> Orgao : consulta 5
    PipelineGerador --> RagCard : seleciona 3..5
    PipelineGerador --> GateAntiPadroes : submete
    PipelineGerador --> DesignBrief : produz
    DesignBrief --> Prova : exige
    Prova --> Preset : registra
    Preset ..> PipelineGerador : realimenta

    note for NucleoFilosofico "PRECEDENCIA: Leis > Modo > Vetores > Cards"
    note for GateAntiPadroes "Gate nao e sugestao: reprovou, nao entrega"
```

**Invariantes de classe:**

| # | Invariante | Onde é imposta |
|---|---|---|
| I1 | Nenhum passo do pipeline pula o anterior | CONTRACT (seções obrigatórias) |
| I2 | Vetor sem justificativa invalida a geração | VECTORS |
| I3 | Card entra por lei, nunca por aparência | Lei 3 + gate item 5 |
| I4 | Atrito fora do mapa é bug, não feature | Lei 2 + gate itens 3–4 |
| I5 | Identidade sem prova não existe | Passo 9 |
| I6 | Preset só nasce de geração aprovada E provada | CONTRACT (registro) |

---

## 3. Diagrama de sequência — uma geração

```mermaid
sequenceDiagram
    autonumber
    actor Max as Max (diretor)
    participant Ag as Agente de design
    participant M as Mente (contrato)
    participant O as Órgãos (5)
    participant R as RAG (cards)
    participant G as Gate (12 itens)

    Max->>Ag: pedido: produto + contexto (NUNCA "estilo X")
    Ag->>M: carrega MANIFESTO+CONTRACT+VECTORS+MODES
    M->>Ag: diagnóstico obrigatório
    Ag->>Ag: nomeia operador, máquina, emoção
    Ag->>M: escolhe modo (1 linha de justificativa)
    Ag->>M: calibra 6 vetores (justificativa por eixo)
    Ag->>O: faz as 5 perguntas dos órgãos
    O-->>Ag: peso da decisão · matéria · toque · visibilidade · memória
    Ag->>R: seleciona 3–5 cards pelo diagnóstico
    R-->>Ag: leis de composição (nunca aparências)
    Ag->>Ag: 3 planos + mapa de atrito + sistema visual
    Ag->>G: submete o brief completo
    alt gate reprova (qualquer SIM)
        G-->>Ag: item violado + passo de origem
        Ag->>Ag: corrige e resubmete
    else gate aprova
        G-->>Ag: aprovado
        Ag->>Max: Design Brief + PROVA mínima
        Max-->>Ag: veredito estético
        Ag->>M: registra preset (vetores+modo+cards+prova)
    end
```

---

## 4. Máquina de estados — atrito e cerimônia

O coração da Lei 2: **como uma ação recebe (ou não) rito.**

```mermaid
stateDiagram-v2
    [*] --> Classificacao : ação chega ao design

    state Classificacao {
        [*] --> pergunta1
        pergunta1 : Tem consequência? (risco, irreversível, custo, delegação a máquina, autorização)
        pergunta1 --> SemConsequencia : não
        pergunta1 --> ComConsequencia : sim
    }

    SemConsequencia --> Fluida : Lei 2
    Fluida : FLUIDA — cerimonialidade 0
    Fluida : buscar · ler · copiar · navegar · fechar dica · trocar aba
    Fluida --> [*] : ação instantânea, zero atrito

    ComConsequencia --> Nivel3 : reversível, custo baixo
    ComConsequencia --> Nivel5 : reversível com custo OU muda modo
    ComConsequencia --> Nivel8 : irreversível OU delega poder a máquina
    ComConsequencia --> Nivel10 : ativa sistema com consequência externa contínua

    Nivel3 : RITO 3 — confirmação leve
    Nivel3 : um gesto a mais, consequência anunciada
    Nivel5 : RITO 5 — gesto deliberado
    Nivel5 : segurar, arrastar, girar — o corpo participa
    Nivel8 : RITO 8 — ritual de autorização
    Nivel8 : consequência LIDA antes, confirmação consciente
    Nivel10 : RITO 10 — sequência de acoplamento
    Nivel10 : calibragem, ativação por etapas, estado visível em cada uma

    Nivel3 --> Registro
    Nivel5 --> Registro
    Nivel8 --> Registro
    Nivel10 --> Registro
    Registro : entra no MAPA DE ATRITO do brief
    Registro --> [*]

    note right of Fluida
        Atrito aqui = gate item 3
        (reprovação automática)
    end note
```

---

## 5. Ciclo de vida — deploy e aprendizado

```mermaid
flowchart TD
    A["repo v1truvio<br/>(fonte da mente)"] -->|Fase 1: skill| B["skill v1truvio<br/>GATE 0: consentimento explícito"]
    B --> C["sessão de design<br/>(agente + contrato)"]
    C --> D["Design Brief aprovado no gate"]
    D --> E["aterrissagem: tokens DTCG + CSS + specimen<br/>(padrão herdado do ALMUS)"]
    E --> F["PROVA: specimen julgado pelo Max<br/>+ uiproof quando virar app"]
    F -->|aprovado| G["preset registrado em presets/"]
    G -->|PR| A
    F -->|reprovado| C
    H["experiência de campo<br/>(cards novos, travas ajustadas)"] -->|PR curado| A
```

**Regra do ciclo:** a mente só muda por PR no repo (curadoria) — nunca por drift de sessão. O que a sessão aprende e quer ensinar à mente vira PR de card, trava ou preset; o resto morre com a sessão.
