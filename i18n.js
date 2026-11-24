'use strict';
(function (root) {
	const es = {
		'examples.title': 'Explora 24 flujos de ejemplo de Aurelia AI',
		'examples.description':
			'Elige un flujo para precargar tu borrador. Nada se ejecuta hasta que lo envíes. Los ejercicios Demo corren en modo simulado; los flujos de modo real conectan con tu servidor local de Aurelia AI.',
		'examples.modes':
			'Demo muestra una simulación de cuatro pasos sin consumir créditos de IA ni escribir en tu CRM. El modo real conecta tu arquitectura local de 3 capas (Frontend :3000, API/RAG/MCP :3001 y Collector :8888) con tus proveedores Multi-LLM.',
		'examples.demo': 'Flujo Demo',
		'examples.live': 'Flujo modo real',
		'examples.01.title': 'Calificación de lead entrante',
		'examples.01.prompt':
			'Analiza una consulta comercial nueva, clasifica urgencia y presupuesto, y genera una ficha lista para el CRM local de Aurelia AI.',
		'examples.02.title': 'Propuesta comercial desde catálogo PDF',
		'examples.02.prompt':
			'Consulta el catálogo de servicios indexado en RAG y redacta una propuesta ejecutiva con precios, alcances y citas exactas por documento.',
		'examples.03.title': 'Seguimiento post-reunión de ventas',
		'examples.03.prompt':
			'Resume los acuerdos clave de una llamada comercial, define tres próximos pasos con fecha y prepara un correo en modo Draft Only.',
		'examples.04.title': 'Comparativa de planes para cliente',
		'examples.04.prompt':
			'Compara dos paquetes de servicio usando solo la documentación oficial indexada y devuelve una tabla clara con citas de respaldo.',
		'examples.05.title': 'Respuesta 24/7 a preguntas frecuentes',
		'examples.05.prompt':
			'Responde una duda frecuente de soporte citando únicamente el manual del cliente en el workspace RAG sin inventar políticas.',
		'examples.06.title': 'Clasificación de tickets de soporte',
		'examples.06.prompt':
			'Clasifica un ticket entrante por prioridad, módulo afectado y equipo responsable, y sugiere una respuesta inicial verificada.',
		'examples.07.title': 'Escalado de incidencia crítica',
		'examples.07.prompt':
			'Evalúa un reporte de fallo urgente, reúne contexto del historial del cliente en el CRM local y prepara un resumen para ingeniería.',
		'examples.08.title': 'Recordatorio y confirmación de cita médica',
		'examples.08.prompt':
			'Genera un flujo de confirmación de cita para clínica con instrucciones previas extraídas del protocolo PDF y confirmación de horario.',
		'examples.09.title': 'Triaje inicial de consulta en clínica',
		'examples.09.prompt':
			'Recopila motivo de visita, especialidad solicitada y disponibilidad del paciente para preparar la reserva sin emitir diagnósticos.',
		'examples.10.title': 'Reprogramación automática de agenda',
		'examples.10.prompt':
			'Detecta una solicitud de cambio de cita, propone dos huecos alternativos y prepara la actualización mediante MCP en modo Draft Only.',
		'examples.11.title': 'Consulta estricta de SOP operativo',
		'examples.11.prompt':
			'Busca el procedimiento estándar de apertura y cierre en los documentos indexados y devuelve una lista numerada con citas por sección.',
		'examples.12.title': 'Auditoría rápida de cumplimiento interno',
		'examples.12.prompt':
			'Verifica una lista de control operativa contra las políticas vigentes del workspace RAG y señala brechas o documentos sin respaldo.',
		'examples.13.title': 'Onboarding de nuevo integrante',
		'examples.13.prompt':
			'Crea una guía de primera semana usando los manuales internos indexados por el Document Collector (:8888) con enlaces a cada fuente.',
		'examples.14.title': 'Extracción de cláusulas de contrato',
		'examples.14.prompt':
			'Lee un contrato PDF en el workspace, extrae plazos de renovación, SLA y penalizaciones, y cita la página exacta de cada hallazgo.',
		'examples.15.title': 'Resumen ejecutivo de informe financiero',
		'examples.15.prompt':
			'Resume los indicadores principales de un reporte trimestral indexado en cinco puntos verificables con cita documental estricta.',
		'examples.16.title': 'Cruce de políticas entre dos documentos',
		'examples.16.prompt':
			'Compara la política de reembolsos vigente frente a la versión anterior y lista únicamente los cambios confirmados en el texto.',
		'examples.17.title': 'Actualización de pipeline en CRM local',
		'examples.17.prompt':
			'Revisa oportunidades activas en el CRM local, detecta tratos sin actividad reciente y redacta recordatorios personalizados en borrador.',
		'examples.18.title': 'Segmentación de clientes para reactivación',
		'examples.18.prompt':
			'Agrupa contactos del CRM local por industria y última compra, y propone un guion de contacto breve para cada segmento.',
		'examples.19.title': 'Ficha 360° antes de reunión comercial',
		'examples.19.prompt':
			'Combina notas del CRM local y documentos del cliente en RAG para entregar un brief ejecutivo de una página antes de la llamada.',
		'examples.20.title': 'Flujo visual de 5 nodos para soporte',
		'examples.20.prompt':
			'Diseña un flujo visual de 5 nodos (Entrada → Consulta RAG → Guardrail → Borrador → Registro CRM) para automatizar soporte nivel 1.',
		'examples.21.title': 'Consulta MCP en modo Read-Only',
		'examples.21.prompt':
			'Ejecuta una consulta segura mediante el MCP Server Hub en modo Read-Only para inspeccionar el estado de pedidos sin modificar registros.',
		'examples.22.title': 'Borrador seguro con guardrail Draft Only',
		'examples.22.prompt':
			'Prepara una respuesta de cotización usando herramientas MCP bajo política Draft Only para aprobación humana antes del envío.',
		'examples.23.title': 'Escritura acotada con Scoped Write',
		'examples.23.prompt':
			'Registra una nota estructurada y etiqueta de seguimiento en el CRM local bajo guardrail Scoped Write con trazabilidad completa.',
		'examples.24.title': 'Enrutamiento Multi-LLM (Local vs Cloud)',
		'examples.24.prompt':
			'Evalúa qué tareas sensibles deben correr en Ollama o LM Studio local y cuáles en OpenAI, Anthropic o Gemini para optimizar coste y privacidad.',

		// Activation & deployment notes
		'commercial.title': 'Aurelia AI v1.19.0 · Self-Hosted & Control Total',
		'commercial.terms':
			'Explora el modo Demo simulada gratis o despliega la arquitectura self-hosted de 3 capas (Frontend :3000, API/RAG/MCP :3001 y Document Collector :8888) directamente en tu infraestructura.',
		'commercial.ai':
			'Multi-LLM sin bloqueos: conecta OpenAI, Anthropic o Gemini con tu propia clave API, o ejecuta modelos 100% privados en local con Ollama y LM Studio.',
		'commercial.status':
			'Repositorio oficial: https://github.com/annoris/aurelia · Demo en vivo: https://annoris.github.io/aurelia/',
		'solana.cardNumber': '03 / MCP & GUARDRAILS · SEGURIDAD',
		'solana.cardTitle': 'MCP Server Hub · Políticas de ejecución',
		'solana.cardBody':
			'Cada herramienta conectada en Aurelia AI opera bajo permisos explícitos (Read-Only, Draft Only o Scoped Write) para garantizar trazabilidad y control humano.',
		'solana.walletLabel': 'REPOSITORIO OFICIAL DE AURELIA AI',
		'solana.minBadge': 'Self-Hosted · Read-Only / Draft Only / Scoped Write',
		'solana.copyWallet': 'Copiar URL',
		'solana.payLink': 'Ver en GitHub ↗',
		'solana.memoLabel': 'Identificador de workspace (opcional):',
		'solana.signatureLabel': 'Token o perfil de verificación MCP',
		'solana.signaturePlaceholder':
			'Introduce el identificador de política MCP (Read-Only / Draft Only / Scoped Write)…',
		'solana.verifyButton': 'Verificar política MCP',
		'solana.statusPending':
			'Estado: Modo Demo activo (arquitectura local lista para conectar).',
		'solana.statusVerified':
			'● Política verificada ({amount} · {currency}) · Servidor local listo.',
		'toast.walletCopied': 'Enlace oficial de Aurelia AI copiado al portapapeles.',
		'toast.solanaVerified': 'Configuración verificada. Modo real listo en Aurelia AI.',

		// Document metadata
		'meta.title': 'Aurelia AI — Pon el conocimiento de tu negocio a trabajar',
		'meta.description':
			'Aurelia AI (v1.19.0): plataforma self-hosted de IA para negocios con RAG citado, flujos visuales de 5 nodos, CRM local, MCP Server Hub y enrutamiento Multi-LLM.',

		// Accessibility & skip link
		skipLink: 'Saltar al contenido',
		'skip.link': 'Saltar al contenido',
		'sidebar.ariaLabel': 'Navegación principal',
		'brand.ariaLabel': 'Aurelia AI inicio',
		'menu.open': 'Abrir menú',
		'menu.close': 'Cerrar menú',
		'motion.pause': 'Pausar animaciones',
		'motion.resume': 'Activar animaciones',
		'lang.toggleAria': 'Cambiar idioma a inglés',
		'lang.switchToEn': 'Cambiar idioma a inglés',
		'lang.switchToEs': 'Cambiar idioma a español',

		// Sidebar
		'sidebar.workspace': 'TU WORKSPACE AURELIA',
		'nav.overview': 'Vista general',
		'nav.inicio': 'Vista general',
		'nav.missions': 'Flujos y ejecuciones',
		'nav.misiones': 'Flujos y ejecuciones',
		'nav.connections': 'Proveedores y MCP',
		'nav.conexiones': 'Proveedores y MCP',
		'nav.guide': 'Arquitectura y guía',
		'nav.guia': 'Arquitectura y guía',
		'sidebar.noteTitle': 'Tu conocimiento.<br />Control total.',
		'sidebar.noteSubtitle': 'RAG citado, flujos y CRM local.',
		'sidebar.localTitle': 'aurelia. · Self-Hosted',
		'sidebar.localSubtitle': '3 capas locales · v1.19.0',

		// Topbar
		'topbar.workspace': 'Aurelia Workspace',
		'breadcrumb.inicio': 'Vista general',
		'breadcrumb.misiones': 'Flujos y ejecuciones',
		'breadcrumb.conexiones': 'Proveedores y MCP',
		'breadcrumb.guia': 'Arquitectura y guía',
		'server.connecting': 'Conectando',
		'server.online': 'API :3001 activa',
		'server.offline': 'Modo showcase',
		'topbar.guide': 'Guía de Aurelia AI',

		// View: Inicio / Hero
		'hero.eyebrow': 'PLATAFORMA SELF-HOSTED DE IA PARA NEGOCIOS',
		'hero.edition': 'AURELIA AI / v1.19.0',
		'hero.kicker': 'RAG con citas estrictas, flujos de 5 nodos, CRM local y MCP.',
		'hero.title':
			'Pon el conocimiento de tu negocio a trabajar.<br /><span>Ahora, con control total.</span>',
		'hero.subtitle':
			'Arquitectura local de 3 capas (:3000, :3001, :8888).<br />Automatiza ventas, soporte 24/7, agenda y operaciones<br />con guardrails MCP y enrutamiento Multi-LLM.',
		'hero.newMission': 'Ejecutar un flujo',
		'hero.demo': 'Verlo en acción',
		'hero.demoPrompt':
			'Consulta el catálogo indexado en RAG y redacta una propuesta comercial con citas exactas',
		'hero.footnote':
			'Self-hosted. RAG citado. Multi-LLM (Cloud + Ollama/LM Studio).',

		// Hero Art
		'art.explore': 'indexar',
		'art.ideaInMotion': 'conocimiento en acción',
		'art.search': 'Consulta documentos con citas estrictas',
		'art.goalFound': 'CITA VERIFICADA',
		'art.tabsToAnswers': 'De documentos a acciones.',
		'art.chipTop': 'Guardrail MCP activo',
		'art.chipBottom': '5 nodos. CRM y RAG conectados.',
		'art.coordinate': 'FRONTEND :3000 \u00a0 / \u00a0 API :3001 \u00a0 / \u00a0 COLLECTOR :8888',

		// Composer
		'composer.title': '¿Qué flujo de negocio quieres activar?',
		'composer.badge': 'ORQUESTADOR AURELIA AI',
		'composer.taskLabel': 'Describe tu flujo o consulta RAG',
		'composer.placeholder':
			'Calificar un lead, consultar un SOP con citas, preparar un borrador MCP…',
		'composer.modeAria': 'Modo de ejecución',
		'composer.modeDemo': 'Demo simulada',
		'composer.modeLive': 'Servidor local (:3001)',
		'composer.hintDemo': 'Prueba la experiencia sin conectar claves ni modelos.',
		'composer.hintLive':
			'Ejecuta en tu instancia local de Aurelia AI con RAG, CRM y MCP.',
		'composer.submitDemo': 'Iniciar demo',
		'composer.submitLive': 'Ejecutar flujo',

		// Suggestions
		'suggestions.label': 'O prueba un preset',
		'suggestions.idea': '↗ Propuesta con RAG citado',
		'suggestions.ideaPrompt':
			'Consulta el catálogo de servicios indexado en RAG y redacta una propuesta con citas exactas',
		'suggestions.compare': '⇄ Soporte 24/7 con guardrails',
		'suggestions.comparePrompt':
			'Responde una consulta de soporte 24/7 usando el manual indexado y prepara un borrador MCP en modo Draft Only',
		'suggestions.resources': '⊞ Flujo de 5 nodos + CRM local',
		'suggestions.resourcesPrompt':
			'Califica un lead entrante, actualiza su ficha en el CRM local bajo Scoped Write y agenda seguimiento',

		// Recent missions
		'recent.title': 'Últimas ejecuciones',
		'recent.viewAll': 'Ver todos los flujos',

		// Principles
		'principles.oneTitle': 'RAG con citas estrictas',
		'principles.oneBody':
			'Cada respuesta se respalda en documentos reales procesados por el Document Collector (:8888).',
		'principles.twoTitle': 'MCP Server Hub con guardrails',
		'principles.twoBody':
			'Permisos granulares Read-Only, Draft Only y Scoped Write sobre tus herramientas y CRM local.',
		'principles.threeTitle': 'Multi-LLM sin ataduras',
		'principles.threeBody':
			'Enruta entre OpenAI, Anthropic, Gemini o modelos privados locales en Ollama y LM Studio.',

		// View: Misiones (History)
		'missions.eyebrow': 'REGISTRO DE EJECUCIONES Y TRAZABILIDAD',
		'missions.title': 'Todos tus flujos',
		'missions.titleHtml': 'Todos tus flujos<span>.</span>',
		'missions.subtitle':
			'Cada consulta RAG, borrador MCP y actualización de CRM queda auditada en local.',
		'missions.new': 'Nuevo flujo',
		'missions.searchPlaceholder': 'Buscar un flujo o resultado…',
		'missions.searchAria': 'Buscar flujos',
		'missions.filterAria': 'Filtrar por estado',
		'missions.filterAll': 'Todos los estados',
		'missions.filterRunning': 'En ejecución',
		'missions.filterCompleted': 'Completados',
		'missions.filterFailed': 'Con errores',
		'missions.filterCancelled': 'Cancelados',

		// View: Conexiones (Settings)
		'connections.eyebrow': 'ENRUTAMIENTO MULTI-LLM & MCP',
		'connections.title': 'Conecta tus modelos',
		'connections.titleHtml': 'Conecta tus modelos<span>.</span>',
		'connections.subtitle':
			'Elige OpenAI, Anthropic, Gemini, Ollama o LM Studio. Tus datos permanecen en tu servidor.',
		'connections.card1Number': '01 / PROVEEDOR MULTI-LLM',
		'connections.card1Title': 'Tu inteligencia, tus reglas.',
		'connections.card1Body':
			'Selecciona el proveedor y el modelo exacto para tus workspaces RAG y agentes visuales. La configuración se guarda en el servidor API (:3001).',
		'connections.providerLabel': 'Proveedor LLM',
		'connections.loadingProviders': 'Cargando proveedores…',
		'connections.modelLabel': 'Identificador exacto del modelo',
		'connections.modelPlaceholder': 'Ej. gpt-4o, claude-3-7-sonnet, gemini-2.5-pro, llama3.3',
		'connections.baseUrlLabel': 'Endpoint local o compatible',
		'connections.baseUrlHint':
			'URL de Ollama (:11434) o LM Studio (:1234). No incluyas claves ni tokens en la URL.',
		'connections.providerHintDefault':
			'Las claves API se configuran en .env del servidor (:3001); nunca se exponen en el frontend.',
		'connections.save': 'Guardar proveedor',
		'connections.check': 'Comprobar arquitectura',
		'connections.noneSaved': 'Todavía no hay un proveedor guardado.',
		'connections.savedPrefix': 'Activo en Aurelia AI: ',
		'connections.savedItem': 'Activo en Aurelia AI: {provider} · {model}',
		'connections.checking': 'Comprobando servicios locales (:3000 / :3001 / :8888)…',
		'connections.checkFootnote':
			'Comprobación local de configuración y puertos. No consume créditos de tu proveedor LLM.',
		'connections.card2Number': '02 / ARQUITECTURA DE 3 CAPAS',
		'connections.card2Title': 'Privacidad self-hosted.',
		'connections.howToKeys': 'Ver documentación en GitHub ↗',
		'connections.privacyTitle': 'Tus documentos, en tu servidor.',
		'connections.privacyBody':
			'Aurelia AI separa Frontend (:3000), API/RAG/MCP Server (:3001) y Document Collector (:8888). El CRM local y los vectores viven en tu máquina; con Ollama o LM Studio ningún dato sale de tu red.',
		'connections.engineName': 'API / RAG / MCP Server (:3001)',
		'connections.engineReady': 'Disponible',
		'connections.engineMissing': 'Inicia el servidor local',
		'connections.keyPresent': 'Clave detectada en .env',
		'connections.keyMissing': 'Sin clave en el servidor',
		'connections.keyOptional': 'Modo local sin clave externa',
		'provider.hintKey':
			'Configura {env} en el archivo .env del servidor y reinicia Aurelia AI. No pegues claves aquí.',
		'provider.hintOllama':
			'Ollama o LM Studio corren en local. Verifica que el servicio esté activo y el modelo cargado.',
		'provider.hintCompatible':
			'La clave del endpoint compatible, si aplica, se configura en las variables de entorno del servidor.',

		// View: Guía
		'guide.eyebrow': 'ARQUITECTURA DE 3 CAPAS · v1.19.0',
		'guide.title': 'Cómo funciona Aurelia AI',
		'guide.titleHtml': 'Cómo funciona Aurelia AI<span>.</span>',
		'guide.subtitle':
			'Despliega tu plataforma privada de agentes, RAG citado, CRM local y MCP en minutos.',
		'guide.card1Number': '01 / DOCUMENT COLLECTOR (:8888)',
		'guide.card1Title': 'Ingesta y RAG con citas estrictas.',
		'guide.card1Body':
			'Sube PDFs, SOPs, contratos o catálogos al <strong>Document Collector (:8888)</strong>. Aurelia AI trocea, indexa y responde citando exactamente cada documento fuente.',
		'guide.card1Link': 'Probar flujo RAG ↗',
		'guide.card2Number': '02 / MULTI-LLM (:3001)',
		'guide.card2Title': 'Enrutamiento Cloud y Local.',
		'guide.card2Body':
			'Conecta <strong>OpenAI, Anthropic o Gemini</strong> vía <code>.env</code>, o corre 100% offline con <strong>Ollama</strong> y <strong>LM Studio</strong>. El servidor API/RAG/MCP (:3001) gestiona workspaces, memoria y CRM local.',
		'guide.card2Code':
			'OPENAI_API_KEY=tu_clave\nANTHROPIC_API_KEY=tu_clave\nGEMINI_API_KEY=tu_clave\nOLLAMA_BASE_URL=http://127.0.0.1:11434',
		'guide.card2Link': 'Configurar proveedores ↗',
		'guide.card3Number': '03 / FLUJOS DE 5 NODOS & MCP',
		'guide.card3Title': 'Automatización con guardrails.',
		'guide.card3Body1':
			'Orquesta <strong>flujos visuales de 5 nodos</strong> conectados al <strong>MCP Server Hub</strong> y a tu CRM local para ventas, soporte 24/7, clínicas y operaciones.',
		'guide.card3Body2':
			'Define permisos por herramienta: <strong>Read-Only</strong> para consultas, <strong>Draft Only</strong> para aprobación humana y <strong>Scoped Write</strong> para escrituras auditadas.',
		'guide.card4Number': '04 / CÓDIGO Y COMUNIDAD',
		'guide.card4Title': 'Aurelia AI v1.19.0 · Open Architecture.',
		'guide.card4Body':
			'Copyright © 2026 Aurelia AI. Explora la arquitectura, documentación y demo en vivo en https://github.com/annoris/aurelia y https://annoris.github.io/aurelia/.',

		// Footer
		'footer.tag': 'CONOCIMIENTO CITADO. AUTOMATIZACIÓN CON CONTROL TOTAL.',
		'footer.link': 'Aurelia AI v1.19.0 · Arquitectura y GitHub ↗',

		// Mission Detail Dialog
		'detail.modeDefault': 'FLUJO AURELIA',
		'detail.modeDemo': 'DEMO SIMULADA / SIN LLAMADAS EXTERNAS',
		'detail.modeLive': 'EJECUCIÓN LOCAL / API :3001',
		'detail.closeAria': 'Cerrar detalles',
		'detail.preparing': 'Ejecutando nodos del flujo…',
		'detail.copy': 'Copiar resultado',
		'detail.download': 'Descargar',
		'detail.cancel': 'Cancelar flujo',
		'detail.delete': 'Eliminar del registro',
		'detail.confirmDelete': 'Confirmar eliminación',
		'detail.partialResult': 'Resultado parcial:',
		'detail.errorLabel': 'Error:',

		// Statuses & Modes
		'status.queued': 'En cola',
		'status.running': 'En ejecución',
		'status.completed': 'Completado',
		'status.failed': 'Con errores',
		'status.cancelled': 'Cancelado',
		'mode.demo': 'Demo simulada',
		'mode.live': 'Servidor local (:3001)',
		'mode.liveDownload': 'Flujo real',

		// Empty states
		'empty.filteredTitle': 'Ningún flujo coincide.',
		'empty.filteredBody': 'Prueba otra búsqueda o cambia el filtro de estado.',
		'empty.defaultTitle': 'Aquí empieza tu primer flujo en Aurelia AI.',
		'empty.defaultBody':
			'Ejecuta una consulta RAG, actualiza el CRM local o prueba un flujo de 5 nodos.',
		'empty.defaultAction': 'Crear mi primer flujo ↗',
		'empty.offlineTitle': 'Servidor local de Aurelia AI no detectado.',
		'empty.offlineBody':
			'Inicia los servicios (:3000, :3001, :8888) o continúa explorando el modo Demo.',

		// Toasts & Errors
		'toast.demoStarted': 'Demo de Aurelia AI iniciada (ejecución simulada).',
		'toast.liveStarted': 'Flujo enviado al servidor local de Aurelia AI (:3001).',
		'toast.cancelRequested':
			'Cancelación solicitada. Las acciones ya confirmadas no se revierten.',
		'toast.missionDeleted': 'Ejecución eliminada del historial local.',
		'toast.resultCopied': 'Resultado copiado al portapapeles.',
		'toast.copyFailed':
			'No se pudo copiar. Puedes seleccionar el texto manualmente.',
		'toast.selectProviderModel': 'Elige un proveedor LLM e introduce tu modelo.',
		'toast.connectionSaved': 'Proveedor guardado en el servidor de Aurelia AI.',
		'error.requestFailed': 'No se pudo completar la solicitud.',
		'error.timeout':
			'El servidor está tardando en responder. Inténtalo de nuevo.',
		'error.offline':
			'No hay conexión con el servidor API (:3001). Comprueba que Aurelia AI está activo.',
		'error.modelRequired':
			'Guarda un proveedor y modelo antes de ejecutar un flujo en modo real.',
	};

	const en = {
		'examples.title': 'Explore 24 Aurelia AI example workflows',
		'examples.description':
			'Pick a workflow to populate your draft. Nothing runs until you submit it. Demo exercises run locally in simulated mode; Live workflows connect to your self-hosted Aurelia AI server.',
		'examples.modes':
			'Demo runs a four-step simulation without LLM usage or CRM writes. Live mode connects your 3-tier self-hosted stack (Frontend :3000, API/RAG/MCP :3001, Document Collector :8888) with Multi-LLM routing.',
		'examples.demo': 'Demo flow',
		'examples.live': 'Live workflow',
		'examples.01.title': 'Inbound sales lead qualification',
		'examples.01.prompt':
			'Analyze a new inbound business inquiry, score urgency and budget, and generate a structured lead card for the Aurelia AI Local CRM.',
		'examples.02.title': 'Proposal drafted from PDF catalog',
		'examples.02.prompt':
			'Query the RAG-indexed service catalog and draft an executive proposal with pricing, scope, and strict per-document citations.',
		'examples.03.title': 'Post-call sales follow-up',
		'examples.03.prompt':
			'Summarize key agreements from a discovery call, define three dated next steps, and prepare a follow-up email under Draft Only guardrails.',
		'examples.04.title': 'Client service tier comparison',
		'examples.04.prompt':
			'Compare two service tiers using only indexed official documentation and return a concise comparison table with verified citations.',
		'examples.05.title': '24/7 grounded support FAQ',
		'examples.05.prompt':
			'Answer a recurring customer support question citing only the client handbook in the RAG workspace without inventing policies.',
		'examples.06.title': 'Automated support ticket triage',
		'examples.06.prompt':
			'Classify an incoming support ticket by priority, affected area, and owner team, and draft a policy-grounded initial reply.',
		'examples.07.title': 'Critical incident escalation brief',
		'examples.07.prompt':
			'Evaluate an urgent issue report, pull client context from the Local CRM, and assemble a concise escalation brief for engineering.',
		'examples.08.title': 'Clinic appointment confirmation',
		'examples.08.prompt':
			'Run a clinic booking confirmation flow with pre-visit preparation instructions extracted strictly from the indexed protocol PDF.',
		'examples.09.title': 'Patient intake & scheduling prep',
		'examples.09.prompt':
			'Capture visit reason, requested specialty, and preferred time windows to prepare a booking without offering medical advice.',
		'examples.10.title': 'Calendar reschedule via MCP',
		'examples.10.prompt':
			'Handle a reschedule request, propose two open slots, and stage the calendar update through the MCP Server Hub in Draft Only mode.',
		'examples.11.title': 'Strict operational SOP lookup',
		'examples.11.prompt':
			'Retrieve opening and closing procedures from indexed internal SOPs and return a numbered checklist with exact section citations.',
		'examples.12.title': 'Internal compliance quick audit',
		'examples.12.prompt':
			'Check an operations checklist against active RAG workspace policies and flag any missing or unsupported steps.',
		'examples.13.title': 'New hire onboarding playbook',
		'examples.13.prompt':
			'Build a first-week onboarding guide from manuals ingested by the Document Collector (:8888) with direct source references.',
		'examples.14.title': 'Contract clause extraction',
		'examples.14.prompt':
			'Inspect an indexed PDF contract, extract renewal windows, SLAs, and penalty clauses, and cite the exact page for each item.',
		'examples.15.title': 'Quarterly report executive brief',
		'examples.15.prompt':
			'Distill key KPIs from an indexed quarterly PDF report into five verifiable bullet points with strict document citations.',
		'examples.16.title': 'Policy diff across two documents',
		'examples.16.prompt':
			'Compare the current refund policy against the previous version in RAG and list only verified textual changes.',
		'examples.17.title': 'Local CRM pipeline hygiene',
		'examples.17.prompt':
			'Review active deals in the Local CRM, flag stale opportunities, and draft tailored follow-up notes for account owners.',
		'examples.18.title': 'Client reactivation segmentation',
		'examples.18.prompt':
			'Group Local CRM contacts by industry and last engagement date, and draft a concise reactivation message per segment.',
		'examples.19.title': 'Pre-meeting 360° account brief',
		'examples.19.prompt':
			'Combine Local CRM notes and RAG account documents into a one-page executive brief before a client call.',
		'examples.20.title': '5-node visual support agent flow',
		'examples.20.prompt':
			'Design a 5-node visual agent flow (Trigger → RAG Lookup → Guardrail → Draft Reply → CRM Log) to automate Tier-1 support.',
		'examples.21.title': 'Read-Only MCP tool query',
		'examples.21.prompt':
			'Run a safe MCP Server Hub lookup under Read-Only permissions to inspect order status without mutating external records.',
		'examples.22.title': 'Draft Only quote preparation',
		'examples.22.prompt':
			'Generate a customer quote using MCP tools locked to Draft Only so a human approves before anything is sent.',
		'examples.23.title': 'Scoped Write CRM update',
		'examples.23.prompt':
			'Write a structured call summary and follow-up tag to the Local CRM under Scoped Write guardrails with full audit logs.',
		'examples.24.title': 'Multi-LLM routing (Local vs Cloud)',
		'examples.24.prompt':
			'Map sensitive workflows to private Ollama or LM Studio models and complex synthesis to OpenAI, Anthropic, or Gemini.',

		// Activation & deployment notes
		'commercial.title': 'Aurelia AI v1.19.0 · Self-Hosted & Full Control',
		'commercial.terms':
			'Explore simulated Demo mode for free or deploy the 3-tier self-hosted stack (Frontend :3000, API/RAG/MCP :3001, Document Collector :8888) on your own infrastructure.',
		'commercial.ai':
			'Multi-LLM without lock-in: connect OpenAI, Anthropic, or Gemini with your own API key, or run 100% private local models with Ollama and LM Studio.',
		'commercial.status':
			'Official repository: https://github.com/annoris/aurelia · Live demo: https://annoris.github.io/aurelia/',
		'solana.cardNumber': '03 / MCP & GUARDRAILS · SECURITY',
		'solana.cardTitle': 'MCP Server Hub · Execution Policies',
		'solana.cardBody':
			'Every connected tool in Aurelia AI runs under explicit guardrails (Read-Only, Draft Only, or Scoped Write) for full auditability and human control.',
		'solana.walletLabel': 'OFFICIAL AURELIA AI REPOSITORY',
		'solana.minBadge': 'Self-Hosted · Read-Only / Draft Only / Scoped Write',
		'solana.copyWallet': 'Copy URL',
		'solana.payLink': 'Open on GitHub ↗',
		'solana.memoLabel': 'Workspace identifier (optional):',
		'solana.signatureLabel': 'MCP policy profile or verification token',
		'solana.signaturePlaceholder':
			'Enter your MCP policy profile (Read-Only / Draft Only / Scoped Write)…',
		'solana.verifyButton': 'Verify MCP policy',
		'solana.statusPending':
			'Status: Demo mode active (self-hosted stack ready to connect).',
		'solana.statusVerified':
			'● Policy verified ({amount} · {currency}) · Local server ready.',
		'toast.walletCopied': 'Official Aurelia AI link copied to clipboard.',
		'toast.solanaVerified': 'Configuration verified. Live mode ready in Aurelia AI.',

		// Document metadata
		'meta.title': 'Aurelia AI — Put your business knowledge to work',
		'meta.description':
			'Aurelia AI (v1.19.0): self-hosted business AI platform with strict document-cited RAG, 5-node visual agent flows, Local CRM, MCP Server Hub, and Multi-LLM routing.',

		// Accessibility & skip link
		skipLink: 'Skip to content',
		'skip.link': 'Skip to content',
		'sidebar.ariaLabel': 'Main navigation',
		'brand.ariaLabel': 'Aurelia AI home',
		'menu.open': 'Open menu',
		'menu.close': 'Close menu',
		'motion.pause': 'Pause animations',
		'motion.resume': 'Resume animations',
		'lang.toggleAria': 'Switch language to Spanish',
		'lang.switchToEn': 'Switch language to English',
		'lang.switchToEs': 'Switch language to Spanish',

		// Sidebar
		'sidebar.workspace': 'YOUR AURELIA WORKSPACE',
		'nav.overview': 'Overview',
		'nav.inicio': 'Overview',
		'nav.missions': 'Flows & Runs',
		'nav.misiones': 'Flows & Runs',
		'nav.connections': 'Providers & MCP',
		'nav.conexiones': 'Providers & MCP',
		'nav.guide': 'Architecture & Guide',
		'nav.guia': 'Architecture & Guide',
		'sidebar.noteTitle': 'Your knowledge.<br />Full control.',
		'sidebar.noteSubtitle': 'Cited RAG, agent flows & Local CRM.',
		'sidebar.localTitle': 'aurelia. · Self-Hosted',
		'sidebar.localSubtitle': '3-tier local stack · v1.19.0',

		// Topbar
		'topbar.workspace': 'Aurelia Workspace',
		'breadcrumb.inicio': 'Overview',
		'breadcrumb.misiones': 'Flows & Runs',
		'breadcrumb.conexiones': 'Providers & MCP',
		'breadcrumb.guia': 'Architecture & Guide',
		'server.connecting': 'Connecting',
		'server.online': 'API :3001 online',
		'server.offline': 'Showcase mode',
		'topbar.guide': 'Aurelia AI Guide',

		// View: Inicio / Hero
		'hero.eyebrow': 'SELF-HOSTED BUSINESS AI PLATFORM',
		'hero.edition': 'AURELIA AI / v1.19.0',
		'hero.kicker': 'Strict-citation RAG, 5-node agent flows, Local CRM & MCP.',
		'hero.title':
			'Put your business knowledge to work.<br /><span>Now, with full control.</span>',
		'hero.subtitle':
			'3-tier self-hosted architecture (:3000, :3001, :8888).<br />Automate sales, 24/7 support, bookings, and SOPs<br />with MCP guardrails and Multi-LLM routing.',
		'hero.newMission': 'Run a workflow',
		'hero.demo': 'See it in action',
		'hero.demoPrompt':
			'Query the RAG-indexed service catalog and draft a proposal with strict document citations',
		'hero.footnote':
			'Self-hosted. Cited RAG. Multi-LLM (Cloud + Ollama/LM Studio).',

		// Hero Art
		'art.explore': 'index',
		'art.ideaInMotion': 'knowledge in motion',
		'art.search': 'Query documents with strict citations',
		'art.goalFound': 'CITATION VERIFIED',
		'art.tabsToAnswers': 'From documents to actions.',
		'art.chipTop': 'MCP guardrail active',
		'art.chipBottom': '5 nodes. CRM & RAG connected.',
		'art.coordinate': 'FRONTEND :3000 \u00a0 / \u00a0 API :3001 \u00a0 / \u00a0 COLLECTOR :8888',

		// Composer
		'composer.title': 'Which business workflow do you want to run?',
		'composer.badge': 'AURELIA AI ORCHESTRATOR',
		'composer.taskLabel': 'Describe your workflow or RAG query',
		'composer.placeholder':
			'Qualify a lead, query an SOP with citations, stage an MCP draft…',
		'composer.modeAria': 'Execution mode',
		'composer.modeDemo': 'Simulated demo',
		'composer.modeLive': 'Local server (:3001)',
		'composer.hintDemo': 'Explore the workflow without API keys or external calls.',
		'composer.hintLive':
			'Runs on your local Aurelia AI stack with RAG, CRM, and MCP.',
		'composer.submitDemo': 'Start demo',
		'composer.submitLive': 'Run workflow',

		// Suggestions
		'suggestions.label': 'Or try a preset',
		'suggestions.idea': '↗ Proposal with cited RAG',
		'suggestions.ideaPrompt':
			'Query the RAG-indexed service catalog and draft an executive proposal with strict citations',
		'suggestions.compare': '⇄ 24/7 support with guardrails',
		'suggestions.comparePrompt':
			'Answer a 24/7 support inquiry using the indexed handbook and stage a Draft Only MCP reply',
		'suggestions.resources': '⊞ 5-node flow + Local CRM',
		'suggestions.resourcesPrompt':
			'Qualify an inbound lead, update the Local CRM under Scoped Write, and schedule follow-up',

		// Recent missions
		'recent.title': 'Recent workflow runs',
		'recent.viewAll': 'View all flows',

		// Principles
		'principles.oneTitle': 'Strict document-cited RAG',
		'principles.oneBody':
			'Every answer is grounded in real files ingested by the Document Collector (:8888).',
		'principles.twoTitle': 'MCP Server Hub with guardrails',
		'principles.twoBody':
			'Granular Read-Only, Draft Only, and Scoped Write permissions across tools and Local CRM.',
		'principles.threeTitle': 'Multi-LLM without lock-in',
		'principles.threeBody':
			'Route across OpenAI, Anthropic, Gemini, or private local models on Ollama and LM Studio.',

		// View: Misiones (History)
		'missions.eyebrow': 'EXECUTION HISTORY & AUDIT LOG',
		'missions.title': 'All your flows',
		'missions.titleHtml': 'All your flows<span>.</span>',
		'missions.subtitle':
			'Every RAG query, MCP draft, and Local CRM update is logged locally.',
		'missions.new': 'New workflow',
		'missions.searchPlaceholder': 'Search a workflow or result…',
		'missions.searchAria': 'Search workflows',
		'missions.filterAria': 'Filter by status',
		'missions.filterAll': 'All statuses',
		'missions.filterRunning': 'Running',
		'missions.filterCompleted': 'Completed',
		'missions.filterFailed': 'Failed',
		'missions.filterCancelled': 'Cancelled',

		// View: Conexiones (Settings)
		'connections.eyebrow': 'MULTI-LLM ROUTING & MCP',
		'connections.title': 'Connect your models',
		'connections.titleHtml': 'Connect your models<span>.</span>',
		'connections.subtitle':
			'Choose OpenAI, Anthropic, Gemini, Ollama, or LM Studio. Your data stays on your server.',
		'connections.card1Number': '01 / MULTI-LLM PROVIDER',
		'connections.card1Title': 'Your intelligence, your rules.',
		'connections.card1Body':
			'Select your provider and exact model identifier for RAG workspaces and visual agent flows. Saved locally on the API server (:3001).',
		'connections.providerLabel': 'LLM Provider',
		'connections.loadingProviders': 'Loading providers…',
		'connections.modelLabel': 'Exact model identifier',
		'connections.modelPlaceholder': 'e.g. gpt-4o, claude-3-7-sonnet, gemini-2.5-pro, llama3.3',
		'connections.baseUrlLabel': 'Local or compatible endpoint',
		'connections.baseUrlHint':
			'Ollama (:11434) or LM Studio (:1234) URL. Never include keys or tokens in the URL.',
		'connections.providerHintDefault':
			'API keys live in the server .env (:3001); they are never exposed in the frontend.',
		'connections.save': 'Save provider',
		'connections.check': 'Check architecture',
		'connections.noneSaved': 'No provider saved yet.',
		'connections.savedPrefix': 'Active in Aurelia AI: ',
		'connections.savedItem': 'Active in Aurelia AI: {provider} · {model}',
		'connections.checking': 'Checking local services (:3000 / :3001 / :8888)…',
		'connections.checkFootnote':
			'Local configuration and port check. Does not consume LLM provider credits.',
		'connections.card2Number': '02 / 3-TIER ARCHITECTURE',
		'connections.card2Title': 'Self-hosted privacy.',
		'connections.howToKeys': 'Read docs on GitHub ↗',
		'connections.privacyTitle': 'Your documents, on your server.',
		'connections.privacyBody':
			'Aurelia AI separates Frontend (:3000), API/RAG/MCP Server (:3001), and Document Collector (:8888). Local CRM and vectors live on your machine; with Ollama or LM Studio zero data leaves your network.',
		'connections.engineName': 'API / RAG / MCP Server (:3001)',
		'connections.engineReady': 'Available',
		'connections.engineMissing': 'Start local server',
		'connections.keyPresent': 'Key detected in .env',
		'connections.keyMissing': 'No key on server',
		'connections.keyOptional': 'Local mode — no external key',
		'provider.hintKey':
			'Set {env} in the server .env file and restart Aurelia AI. Do not paste keys here.',
		'provider.hintOllama':
			'Ollama or LM Studio run locally. Make sure the local service is active and the model is loaded.',
		'provider.hintCompatible':
			'If required, set the compatible endpoint key in the server environment.',

		// View: Guía
		'guide.eyebrow': '3-TIER ARCHITECTURE · v1.19.0',
		'guide.title': 'How Aurelia AI works',
		'guide.titleHtml': 'How Aurelia AI works<span>.</span>',
		'guide.subtitle':
			'Deploy your private platform for cited RAG, 5-node visual agents, Local CRM, and MCP in minutes.',
		'guide.card1Number': '01 / DOCUMENT COLLECTOR (:8888)',
		'guide.card1Title': 'Ingest & strict-citation RAG.',
		'guide.card1Body':
			'Drop PDFs, SOPs, contracts, or catalogs into the <strong>Document Collector (:8888)</strong>. Aurelia AI chunks, indexes, and answers with exact source citations.',
		'guide.card1Link': 'Try RAG workflow ↗',
		'guide.card2Number': '02 / MULTI-LLM (:3001)',
		'guide.card2Title': 'Cloud & Local routing.',
		'guide.card2Body':
			'Connect <strong>OpenAI, Anthropic, or Gemini</strong> via <code>.env</code>, or run 100% offline with <strong>Ollama</strong> and <strong>LM Studio</strong>. The API/RAG/MCP Server (:3001) manages workspaces, memory, and Local CRM.',
		'guide.card2Code':
			'OPENAI_API_KEY=your_key\nANTHROPIC_API_KEY=your_key\nGEMINI_API_KEY=your_key\nOLLAMA_BASE_URL=http://127.0.0.1:11434',
		'guide.card2Link': 'Configure providers ↗',
		'guide.card3Number': '03 / 5-NODE FLOWS & MCP',
		'guide.card3Title': 'Automation with guardrails.',
		'guide.card3Body1':
			'Orchestrate <strong>5-node visual agent flows</strong> wired to the <strong>MCP Server Hub</strong> and your Local CRM for sales, 24/7 support, clinics, and operations.',
		'guide.card3Body2':
			'Enforce per-tool policies: <strong>Read-Only</strong> for lookups, <strong>Draft Only</strong> for human review, and <strong>Scoped Write</strong> for audited updates.',
		'guide.card4Number': '04 / SOURCE & COMMUNITY',
		'guide.card4Title': 'Aurelia AI v1.19.0 · Open Architecture.',
		'guide.card4Body':
			'Copyright © 2026 Aurelia AI. Explore the architecture, documentation, and live showcase at https://github.com/annoris/aurelia and https://annoris.github.io/aurelia/.',

		// Footer
		'footer.tag': 'CITED KNOWLEDGE. AUTOMATION WITH FULL CONTROL.',
		'footer.link': 'Aurelia AI v1.19.0 · Architecture & GitHub ↗',

		// Mission Detail Dialog
		'detail.modeDefault': 'AURELIA FLOW',
		'detail.modeDemo': 'SIMULATED DEMO / NO EXTERNAL CALLS',
		'detail.modeLive': 'LOCAL RUN / API :3001',
		'detail.closeAria': 'Close details',
		'detail.preparing': 'Executing workflow nodes…',
		'detail.copy': 'Copy result',
		'detail.download': 'Download',
		'detail.cancel': 'Cancel flow',
		'detail.delete': 'Remove from log',
		'detail.confirmDelete': 'Confirm deletion',
		'detail.partialResult': 'Partial result:',
		'detail.errorLabel': 'Error:',

		// Statuses & Modes
		'status.queued': 'Queued',
		'status.running': 'Running',
		'status.completed': 'Completed',
		'status.failed': 'Failed',
		'status.cancelled': 'Cancelled',
		'mode.demo': 'Simulated demo',
		'mode.live': 'Local server (:3001)',
		'mode.liveDownload': 'Live workflow',

		// Empty states
		'empty.filteredTitle': 'No matching workflows.',
		'empty.filteredBody': 'Try another search or change the status filter.',
		'empty.defaultTitle': 'Your first Aurelia AI workflow starts here.',
		'empty.defaultBody':
			'Run a cited RAG query, update the Local CRM, or test a 5-node agent flow.',
		'empty.defaultAction': 'Run my first workflow ↗',
		'empty.offlineTitle': 'Local Aurelia AI server not detected.',
		'empty.offlineBody':
			'Start the 3-tier stack (:3000, :3001, :8888) or keep exploring Demo mode.',

		// Toasts & Errors
		'toast.demoStarted': 'Aurelia AI demo started (simulated run).',
		'toast.liveStarted': 'Workflow sent to local Aurelia AI server (:3001).',
		'toast.cancelRequested':
			'Cancellation requested. Confirmed actions cannot be undone.',
		'toast.missionDeleted': 'Run removed from local history.',
		'toast.resultCopied': 'Result copied to clipboard.',
		'toast.copyFailed':
			'Could not copy. You can select the result text manually.',
		'toast.selectProviderModel': 'Choose an LLM provider and enter your model.',
		'toast.connectionSaved': 'Provider saved on your Aurelia AI server.',
		'error.requestFailed': 'Could not complete the request.',
		'error.timeout':
			'The server is taking too long to respond. Please try again.',
		'error.offline':
			'No connection to API server (:3001). Make sure Aurelia AI is running.',
		'error.modelRequired':
			'Save a provider and model before running a live workflow.',
	};

	// Backend, runner, connections, and extra UI phrase pairs [Spanish, English]
	const extraPairs = [
		// Runner step labels & messages
		['Demostración simulada iniciada.', 'Simulated demo started.'],
		[
			'Iniciando servidor API/RAG/MCP (:3001).',
			'Starting API/RAG/MCP server (:3001).',
		],
		['Interpretando el objetivo del flujo.', 'Interpreting workflow goal.'],
		[
			'Consultando índice RAG y verificando citas.',
			'Querying RAG index and verifying citations.',
		],
		[
			'Conectando nodos del flujo y guardrails MCP.',
			'Connecting workflow nodes and MCP guardrails.',
		],
		['Preparando el resultado simulado.', 'Preparing simulated result.'],
		['Demostración finalizada.', 'Demo completed.'],
		[
			'Cancelación solicitada; cerrando la ejecución local.',
			'Cancellation requested; closing local execution.',
		],
		['El flujo no pudo completarse.', 'The workflow could not be completed.'],
		[
			'Ejecutando el flujo con el proveedor LLM configurado; esperando resultado.',
			'Running workflow with the configured LLM provider; awaiting result.',
		],
		[
			'El agente terminó sin completar el objetivo.',
			'The agent finished without completing the goal.',
		],
		[
			'Ejecución finalizada con un resultado incompleto.',
			'Execution finished with an incomplete result.',
		],
		['Resultado recibido del agente.', 'Result received from the agent.'],
		['[credencial oculta]', '[redacted credential]'],
		['El servidor se está cerrando.', 'The server is shutting down.'],
		[
			'Ya hay tres flujos en ejecución. Espera o cancela uno.',
			'Three workflows are already running. Wait or cancel one.',
		],
		[
			'El servidor se reinició antes de terminar este flujo.',
			'The server restarted before this workflow finished.',
		],

		// Connections & providers
		['Ollama local', 'Local Ollama'],
		['LM Studio local', 'Local LM Studio'],
		['API compatible con OpenAI', 'OpenAI-compatible API'],
		['Proveedor y modelo', 'Provider and model'],
		['Credencial en el entorno', 'Credential in environment'],
		[
			'No se necesita clave para este servidor local.',
			'No key required for this local server.',
		],
		[
			'Guarda un proveedor antes de ejecutar un flujo real.',
			'Save a provider before running a live workflow.',
		],
		['Servicios de 3 capas', '3-tier services'],
		[
			'Comprobación local de Frontend (:3000), API (:3001) y Collector (:8888).',
			'Local check of Frontend (:3000), API (:3001), and Collector (:8888).',
		],
		['MCP Server Hub', 'MCP Server Hub'],
		[
			'Verificación de políticas Read-Only, Draft Only y Scoped Write.',
			'Verification of Read-Only, Draft Only, and Scoped Write policies.',
		],
		[
			'Solo se comprobó la configuración local. No se autenticó el proveedor ni se contactó con el servidor del modelo.',
			'Only local configuration was checked. The provider was not authenticated and the model server was not contacted.',
		],
		['Configuración local preparada.', 'Local configuration ready.'],
		['Modelo', 'Model'],
		['Guardado', 'Saved'],
		[
			'La conexión solo admite provider, model y base_url. Guarda las claves en variables de entorno.',
			'Connection only accepts provider, model, and base_url. Store keys in environment variables.',
		],
		[
			'Selecciona un proveedor Multi-LLM de Aurelia AI.',
			'Select a Multi-LLM provider in Aurelia AI.',
		],
		[
			'Escribe el identificador exacto del modelo, de hasta 200 caracteres.',
			'Enter the exact model identifier, up to 200 characters.',
		],
		['La URL del servidor no es válida.', 'The server URL is invalid.'],
		[
			'Usa una URL HTTP(S) sin credenciales, consulta ni fragmentos; por ejemplo http://127.0.0.1:11434/v1.',
			'Use an HTTP(S) URL without credentials, query, or fragments; for example http://127.0.0.1:11434/v1.',
		],
		[
			'La conexión Ollama local requiere localhost o una dirección loopback. Para otro servidor usa API compatible.',
			'Local Ollama connection requires localhost or a loopback address. For another server, use OpenAI-compatible API.',
		],
		[
			'Aurelia AI usa conexiones directas; configura tu propio servidor compatible.',
			'Aurelia AI uses direct connections; configure your own compatible server.',
		],
		[
			'La URL personalizada corresponde al proveedor API compatible.',
			'Custom URL is only for the OpenAI-compatible API provider.',
		],
		[
			'Falta AURELIA_COMPATIBLE_API_KEY para tu servidor remoto.',
			'Missing AURELIA_COMPATIBLE_API_KEY for your remote server.',
		],

		// Server HTTP errors
		[
			'Solo se permiten conexiones locales.',
			'Only local connections are allowed.',
		],
		['Origen no permitido.', 'Origin not allowed.'],
		[
			'No se permiten solicitudes de otros sitios.',
			'Cross-site requests are not allowed.',
		],
		['Longitud de solicitud inválida.', 'Invalid request length.'],
		[
			'El cuerpo JSON debe ocupar entre 1 y 16384 bytes.',
			'JSON body must be between 1 and 16384 bytes.',
		],
		['Envía un cuerpo application/json.', 'Send an application/json body.'],
		[
			'El cuerpo debe ser un objeto JSON válido.',
			'Body must be a valid JSON object.',
		],
		['Flujo no encontrado.', 'Workflow not found.'],
		['Ruta no encontrada.', 'Route not found.'],
		['Archivo no encontrado.', 'File not found.'],
		[
			'Escribe un objetivo de entre 3 y 4000 caracteres.',
			'Enter a goal between 3 and 4000 characters.',
		],
		['Modo o modelo inválido.', 'Invalid mode or model.'],
		[
			'Configura un proveedor propio y un modelo explícito para ejecutar un flujo real.',
			'Configure your own provider and an explicit model to run a live workflow.',
		],
		[
			'Cancela el flujo antes de eliminarlo.',
			'Cancel the workflow before deleting it.',
		],

		// Plain-text & HTML variants
		['Todos tus flujos.', 'All your flows.'],
		['Conecta tus modelos.', 'Connect your models.'],
		['Cómo funciona Aurelia AI.', 'How Aurelia AI works.'],
		[
			'✳ PLATAFORMA SELF-HOSTED DE IA PARA NEGOCIOS',
			'✳ SELF-HOSTED BUSINESS AI PLATFORM',
		],
		[
			'<span class="mini-star">✳</span> PLATAFORMA SELF-HOSTED DE IA PARA NEGOCIOS',
			'<span class="mini-star">✳</span> SELF-HOSTED BUSINESS AI PLATFORM',
		],
		['▶ Verlo en acción', '▶ See it in action'],
		[
			'<span class="play-icon">▶</span> Verlo en acción',
			'<span class="play-icon">▶</span> See it in action',
		],
		[
			'↳ Self-hosted. RAG citado. Multi-LLM (Cloud + Ollama/LM Studio).',
			'↳ Self-hosted. Cited RAG. Multi-LLM (Cloud + Ollama/LM Studio).',
		],
		[
			'<span class="mini-path">↳</span> Self-hosted. RAG citado. Multi-LLM (Cloud + Ollama/LM Studio).',
			'<span class="mini-path">↳</span> Self-hosted. Cited RAG. Multi-LLM (Cloud + Ollama/LM Studio).',
		],
		[
			'<span></span> RAG con citas estrictas, flujos de 5 nodos, CRM local y MCP.',
			'<span></span> Strict-citation RAG, 5-node agent flows, Local CRM & MCP.',
		],
		[
			'⌕ Consulta documentos con citas estrictas ↵',
			'⌕ Query documents with strict citations ↵',
		],
		[
			'<span>⌕</span> Consulta documentos con citas estrictas <b>↵</b>',
			'<span>⌕</span> Query documents with strict citations <b>↵</b>',
		],
		['✳ Guardrail MCP activo', '✳ MCP guardrail active'],
		[
			'<span>✳</span> Guardrail MCP activo',
			'<span>✳</span> MCP guardrail active',
		],
		[
			'✓ 5 nodos. CRM y RAG conectados.',
			'✓ 5 nodes. CRM & RAG connected.',
		],
		[
			'<span class="check-circle">✓</span> 5 nodos. CRM y RAG conectados.',
			'<span class="check-circle">✓</span> 5 nodes. CRM & RAG connected.',
		],
		['Ver todos los flujos ↗', 'View all flows ↗'],
		['Ver todos los flujos <span>↗</span>', 'View all flows <span>↗</span>'],
		['Arquitectura y guía↗', 'Architecture & Guide↗'],
		['Arquitectura y guía ↗', 'Architecture & Guide ↗'],
		['Guía de Aurelia AI↗', 'Aurelia AI Guide↗'],
		['Guía de Aurelia AI ↗', 'Aurelia AI Guide ↗'],
		['Tu conocimiento. Control total.', 'Your knowledge. Full control.'],
		[
			'Tu conocimiento.<br>Control total.',
			'Your knowledge.<br>Full control.',
		],
		[
			'Pon el conocimiento de tu negocio a trabajar.<br><span>Ahora, con control total.</span>',
			'Put your business knowledge to work.<br><span>Now, with full control.</span>',
		],
		[
			'Arquitectura local de 3 capas (:3000, :3001, :8888).<br>Automatiza ventas, soporte 24/7, agenda y operaciones<br>con guardrails MCP y enrutamiento Multi-LLM.',
			'3-tier self-hosted architecture (:3000, :3001, :8888).<br>Automate sales, 24/7 support, bookings, and SOPs<br>with MCP guardrails and Multi-LLM routing.',
		],
	];

	function collapseWs(str) {
		return String(str).replace(/\s+/g, ' ').trim();
	}

	const phrases = { es: {}, en: {} };
	function registerPair(esVal, enVal) {
		if (!esVal || !enVal) return;
		phrases.en[esVal] = enVal;
		phrases.es[enVal] = esVal;
		const normEs = collapseWs(esVal);
		const normEn = collapseWs(enVal);
		if (!phrases.en[normEs]) phrases.en[normEs] = enVal;
		if (!phrases.es[normEn]) phrases.es[normEn] = esVal;
	}

	for (const key of Object.keys(es)) {
		registerPair(es[key], en[key]);
	}
	for (const [esVal, enVal] of extraPairs) {
		registerPair(esVal, enVal);
	}

	function interpolate(str, vars) {
		if (!vars || typeof str !== 'string') return str;
		return str.replace(/\{(\w+)\}/g, (match, k) =>
			vars[k] !== undefined ? String(vars[k]) : match,
		);
	}

	function translateDynamicPattern(text, targetLang) {
		if (typeof text !== 'string' || !text) return null;
		if (targetLang === 'en') {
			let m;
			if ((m = text.match(/^Variable requerida: (.+)\.$/))) {
				return `Required variable: ${m[1]}.`;
			}
			if (
				(m = text.match(
					/^Falta (.+)\. Configura la clave en el entorno o en \.env y reinicia Aurelia AI\.$/,
				))
			) {
				return `Missing ${m[1]}. Set the key in the environment or .env and restart Aurelia AI.`;
			}
			if (
				(m = text.match(
					/^Configura (.+) en \.env o en el entorno y reinicia el servidor\. No pegues claves aquí\.$/,
				))
			) {
				return `Set ${m[1]} in .env or the environment and restart the server. Do not paste keys here.`;
			}
			if ((m = text.match(/^Activo en Aurelia AI: (.+)$/))) {
				return `Active in Aurelia AI: ${translateDynamicPattern(m[1], 'en') || phrases.en[m[1]] || m[1]}`;
			}
			if ((m = text.match(/^Ollama local · (.+)$/))) {
				return `Local Ollama · ${m[1]}`;
			}
			if ((m = text.match(/^LM Studio local · (.+)$/))) {
				return `Local LM Studio · ${m[1]}`;
			}
			if ((m = text.match(/^API compatible con OpenAI · (.+)$/))) {
				return `OpenAI-compatible API · ${m[1]}`;
			}
			if (text.startsWith('DEMOSTRACIÓN SIMULADA —')) {
				return text
					.replace(
						'DEMOSTRACIÓN SIMULADA — sin llamadas externas ni cambios en tu CRM.',
						'SIMULATED DEMO — no external calls and no writes to your CRM.',
					)
					.replace('Objetivo recibido:', 'Goal received:')
					.replace('Ruta de trabajo de ejemplo:', 'Sample workflow:')
					.replace(
						'1. Consultar documentos indexados en el workspace RAG.',
						'1. Query indexed documents in the RAG workspace.',
					)
					.replace(
						'2. Validar citas y políticas de guardrail MCP.',
						'2. Verify citations and MCP guardrail policies.',
					)
					.replace(
						'3. Entregar borrador estructurado y trazabilidad local.',
						'3. Deliver structured draft and local audit trace.',
					)
					.replace(
						'Esta demo permite probar el flujo, los estados y la trazabilidad sin credenciales ni costes. Para ejecutar con datos reales, conecta tu servidor local de Aurelia AI (:3001).',
						'This demo lets you test flows, statuses, and auditability without credentials or costs. For real execution, connect your local Aurelia AI server (:3001).',
					);
			}
			if (text.startsWith('Resultado parcial:\n')) {
				return text.replace(/^Resultado parcial:\n/, 'Partial result:\n');
			}
		} else {
			let m;
			if ((m = text.match(/^Required variable: (.+)\.$/))) {
				return `Variable requerida: ${m[1]}.`;
			}
			if (
				(m = text.match(
					/^Missing (.+)\. Set the key in the environment or \.env and restart Aurelia AI\.$/,
				))
			) {
				return `Falta ${m[1]}. Configura la clave en el entorno o en .env y reinicia Aurelia AI.`;
			}
			if (
				(m = text.match(
					/^Set (.+) in \.env or the environment and restart the server\. Do not paste keys here\.$/,
				))
			) {
				return `Configura ${m[1]} en .env o en el entorno y reinicia el servidor. No pegues claves aquí.`;
			}
			if ((m = text.match(/^Active in Aurelia AI: (.+)$/))) {
				return `Activo en Aurelia AI: ${translateDynamicPattern(m[1], 'es') || phrases.es[m[1]] || m[1]}`;
			}
			if ((m = text.match(/^Local Ollama · (.+)$/))) {
				return `Ollama local · ${m[1]}`;
			}
			if ((m = text.match(/^Local LM Studio · (.+)$/))) {
				return `LM Studio local · ${m[1]}`;
			}
			if ((m = text.match(/^OpenAI-compatible API · (.+)$/))) {
				return `API compatible con OpenAI · ${m[1]}`;
			}
			if (text.startsWith('SIMULATED DEMO —')) {
				return text
					.replace(
						'SIMULATED DEMO — no external calls and no writes to your CRM.',
						'DEMOSTRACIÓN SIMULADA — sin llamadas externas ni cambios en tu CRM.',
					)
					.replace('Goal received:', 'Objetivo recibido:')
					.replace('Sample workflow:', 'Ruta de trabajo de ejemplo:')
					.replace(
						'1. Query indexed documents in the RAG workspace.',
						'1. Consultar documentos indexados en el workspace RAG.',
					)
					.replace(
						'2. Verify citations and MCP guardrail policies.',
						'2. Validar citas y políticas de guardrail MCP.',
					)
					.replace(
						'3. Deliver structured draft and local audit trace.',
						'3. Entregar borrador estructurado y trazabilidad local.',
					)
					.replace(
						'This demo lets you test flows, statuses, and auditability without credentials or costs. For real execution, connect your local Aurelia AI server (:3001).',
						'Esta demo permite probar el flujo, los estados y la trazabilidad sin credenciales ni costes. Para ejecutar con datos reales, conecta tu servidor local de Aurelia AI (:3001).',
					);
			}
			if (text.startsWith('Partial result:\n')) {
				return text.replace(/^Partial result:\n/, 'Resultado parcial:\n');
			}
		}
		return null;
	}

	function normalizeLang(lang) {
		return typeof lang === 'string' && lang.toLowerCase().startsWith('es')
			? 'es'
			: 'en';
	}

	function hasLookup(keyOrText, target) {
		const table = target === 'en' ? en : es;
		const raw = String(keyOrText);
		if (Object.prototype.hasOwnProperty.call(table, raw)) return true;
		if (Object.prototype.hasOwnProperty.call(phrases[target], raw)) return true;
		const norm = collapseWs(raw);
		if (Object.prototype.hasOwnProperty.call(phrases[target], norm)) return true;
		return translateDynamicPattern(raw, target) !== null;
	}

	function t(keyOrText, lang = 'en', vars = undefined) {
		if (keyOrText === null || keyOrText === undefined) return '';
		const target = normalizeLang(lang);
		const table = target === 'en' ? en : es;
		const raw = String(keyOrText);

		if (Object.prototype.hasOwnProperty.call(table, raw)) {
			return interpolate(table[raw], vars);
		}
		if (Object.prototype.hasOwnProperty.call(phrases[target], raw)) {
			return interpolate(phrases[target][raw], vars);
		}
		const norm = collapseWs(raw);
		if (Object.prototype.hasOwnProperty.call(phrases[target], norm)) {
			return interpolate(phrases[target][norm], vars);
		}
		const dynamic = translateDynamicPattern(raw, target);
		if (dynamic !== null) {
			return interpolate(dynamic, vars);
		}
		return interpolate(raw, vars);
	}

	function statusLabels(lang = 'en') {
		const target = normalizeLang(lang);
		return {
			queued: t('status.queued', target),
			running: t('status.running', target),
			completed: t('status.completed', target),
			failed: t('status.failed', target),
			cancelled: t('status.cancelled', target),
		};
	}

	function updateElementContent(el, val, forceHtml = false) {
		if (forceHtml || /<[a-z][\s\S]*>/i.test(val) || val.includes('&nbsp;')) {
			if (
				el._i18nOrigHtml &&
				el._i18nOrigHtml.endsWith('<span>.</span>') &&
				!val.endsWith('<span>.</span>')
			) {
				el.innerHTML = val.replace(/\.$/, '') + '<span>.</span>';
			} else {
				el.innerHTML = val;
			}
			return;
		}
		if (!el.children || el.children.length === 0) {
			el.textContent = val;
			return;
		}
		// Preserve child elements (such as SVG icons, badges, or trailing punctuation spans)
		const textNodes = [];
		for (const node of el.childNodes) {
			if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
				textNodes.push(node);
			}
		}
		if (textNodes.length > 0) {
			const targetNode = textNodes[0];
			const lead = /^\s+/.exec(targetNode.nodeValue)?.[0] || '';
			const trail = /\s+$/.exec(targetNode.nodeValue)?.[0] || '';
			const hasDotSpan =
				el.lastElementChild &&
				el.lastElementChild.tagName === 'SPAN' &&
				el.lastElementChild.textContent.trim() === '.';
			const cleanVal = hasDotSpan ? val.replace(/\.$/, '') : val;
			targetNode.nodeValue = lead + cleanVal + trail;
		} else {
			el.textContent = val;
		}
	}

	function applyDom(rootNode, lang = 'en') {
		const target = normalizeLang(lang);
		const doc =
			rootNode && rootNode.nodeType === 9
				? rootNode
				: rootNode?.ownerDocument ||
					(typeof document !== 'undefined' ? document : null);
		const scope = rootNode || doc;
		if (!scope) return;

		if (doc && doc.documentElement) {
			doc.documentElement.lang = target;
		}
		if (doc && typeof doc.title === 'string') {
			doc.title = t('meta.title', target);
		}
		if (doc) {
			const metaDesc = doc.querySelector('meta[name="description"]');
			if (metaDesc) {
				metaDesc.setAttribute('content', t('meta.description', target));
			}
		}

		scope.querySelectorAll('[data-i18n]').forEach((el) => {
			const key = el.getAttribute('data-i18n');
			if (!key) return;
			if (el._i18nOrigText === undefined) {
				const textNodes = [];
				for (const node of el.childNodes) {
					if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
						textNodes.push(node);
					}
				}
				el._i18nOrigText =
					el.children && el.children.length > 0 && textNodes.length > 0
						? textNodes[0].nodeValue.trim()
						: el.textContent;
				el._i18nOrigHtml = el.innerHTML;
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigText
					: t(el._i18nOrigText, target);
			updateElementContent(el, resolved, false);
		});

		scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
			const key = el.getAttribute('data-i18n-html');
			if (!key) return;
			if (el._i18nOrigHtml === undefined) {
				el._i18nOrigHtml = el.innerHTML;
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigHtml
					: t(el._i18nOrigHtml, target);
			updateElementContent(el, resolved, true);
		});

		scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
			const key = el.getAttribute('data-i18n-placeholder');
			if (!key) return;
			if (el._i18nOrigPlaceholder === undefined) {
				el._i18nOrigPlaceholder = el.getAttribute('placeholder') || '';
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigPlaceholder
					: t(el._i18nOrigPlaceholder, target);
			el.setAttribute('placeholder', resolved);
		});

		scope.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
			const key = el.getAttribute('data-i18n-aria-label');
			if (!key) return;
			if (el._i18nOrigAria === undefined) {
				el._i18nOrigAria = el.getAttribute('aria-label') || '';
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigAria
					: t(el._i18nOrigAria, target);
			el.setAttribute('aria-label', resolved);
		});

		scope.querySelectorAll('[data-i18n-prompt]').forEach((el) => {
			const key = el.getAttribute('data-i18n-prompt');
			if (!key) return;
			if (el._i18nOrigPrompt === undefined) {
				el._i18nOrigPrompt = el.getAttribute('data-prompt') || '';
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigPrompt
					: t(el._i18nOrigPrompt, target);
			el.setAttribute('data-prompt', resolved);
		});

		const langToggle = scope.querySelector('#lang-toggle');
		if (langToggle) {
			langToggle.setAttribute('data-lang', target);
			langToggle.setAttribute(
				'aria-label',
				target === 'en' ? t('lang.switchToEs', 'en') : t('lang.switchToEn', 'es'),
			);
			langToggle.querySelectorAll('[data-lang-opt]').forEach((opt) => {
				opt.classList.toggle(
					'active',
					opt.getAttribute('data-lang-opt') === target,
				);
			});
		}
	}

	const api = {
		es,
		en,
		phrases,
		normalizeLang,
		t,
		statusLabels,
		translateStep: (label, lang = 'es') => t(label, lang),
		translateResult: (result, lang = 'es') => t(result, lang),
		applyDom,
	};

	if (root) {
		root.AURELIA_I18N = api;
		root.TABVENTO_I18N = api;
	}
	if (typeof window !== 'undefined') {
		window.AURELIA_I18N = api;
		window.TABVENTO_I18N = api;
	}
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = api;
	}
})(typeof globalThis !== 'undefined' ? globalThis : this);
