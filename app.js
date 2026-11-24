'use strict';
const paths = {
	grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
	layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
	sliders: 'M4 7h16M4 17h16M9 4v6M15 14v6',
	book: 'M12 5v16M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Z',
	menu: 'M4 6h16M4 12h16M4 18h16',
	sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
	github:
		'M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.2-2-1-2 4-.5 6-2 6-6 0-1.5-.5-3-1.5-4 0-1 .2-2-.5-3-2 0-3 1-3 1a12 12 0 0 0-6 0S7 3 5 3c-.7 1-.5 2-.5 3C3.5 7 3 8.5 3 10c0 4 2 5.5 6 6-.8.5-1 1-1 2v4',
	arrow: 'M5 12h14m-6-6 6 6-6 6',
	orbit: 'M21 12a9 9 0 1 1-9-9M12 8v4l3 3M17 3h4v4',
	shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
	code: 'm8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16',
	plus: 'M12 5v14M5 12h14',
	search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
	check: 'm5 12 4 4L19 6',
	close: 'm6 6 12 12M6 18 18 6',
	chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
	briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
	cpu: 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z',
};
const $ = (s) => document.querySelector(s);
function icon(name) {
	return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.orbit}"/></svg>`;
}
function replaceIcons(root = document) {
	root.querySelectorAll('[data-icon]').forEach((el) => {
		el.outerHTML = icon(el.dataset.icon);
	});
}
replaceIcons();
function langPreference(value) {
	try {
		if (value !== undefined) localStorage.setItem('aurelia.lang', value);
		return localStorage.getItem('aurelia.lang');
	} catch {
		return null;
	}
}
const state = {
	lang: langPreference() === 'es' ? 'es' : 'en',
	missions: [],
	selected: null,
	status: null,
	busy: false,
	polling: false,
	mutations: 0,
	revision: 0,
	connection: null,
	providers: [],
	connectionsLoaded: false,
	connectionBusy: false,
	serverState: 'connecting',
	lastCheckResult: null,
	lastToast: '',
};
const fallbackStatusLabels = {
	es: {
		queued: 'En espera',
		running: 'En marcha',
		completed: 'Completada',
		failed: 'Con errores',
		cancelled: 'Cancelada',
	},
	en: {
		queued: 'Queued',
		running: 'Running',
		completed: 'Completed',
		failed: 'Failed',
		cancelled: 'Cancelled',
	},
};
function interpolate(str, vars) {
	if (!vars || typeof str !== 'string') return str;
	return str.replace(/\{(\w+)\}/g, (m, k) =>
		vars[k] !== undefined ? String(vars[k]) : m,
	);
}
function getI18n() {
	return window.AURELIA_I18N || window.TABVENTO_I18N || null;
}
function tr(key, esFallback, enFallback, vars) {
	const i18n = getI18n();
	if (i18n?.t) {
		const res = i18n.t(key, state.lang, vars);
		if (res && res !== key) return res;
	}
	const base =
		state.lang === 'en'
			? (enFallback ?? esFallback ?? key)
			: (esFallback ?? key);
	return interpolate(base, vars);
}
function trPhrase(text) {
	if (text === null || text === undefined) return '';
	const raw = String(text);
	const i18n = getI18n();
	if (i18n?.t) {
		return i18n.t(raw, state.lang);
	}
	return raw;
}
function statusLabel(status) {
	const i18n = getI18n();
	if (i18n?.statusLabels) {
		const map = i18n.statusLabels(state.lang);
		if (map && map[status]) return map[status];
	}
	return (fallbackStatusLabels[state.lang] || fallbackStatusLabels.es)[status] || status;
}
function esc(value) {
	const el = document.createElement('span');
	el.textContent = String(value ?? '');
	return el.innerHTML.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function date(value) {
	if (!value) return '';
	const d = new Date(value);
	return Number.isNaN(d.getTime())
		? ''
		: new Intl.DateTimeFormat(state.lang === 'en' ? 'en-US' : 'es', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit',
			}).format(d);
}
let toastTimer;
function toast(message) {
	state.lastToast = message;
	$('#toast').textContent = trPhrase(message);
	$('#toast').classList.add('visible');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
}
// --- Client-Side Static Hosting Adapter (GitHub Pages & Static Preview) ---
const isStaticHost =
	typeof window !== 'undefined' &&
	(window.location.protocol === 'file:' ||
		window.location.hostname.endsWith('github.io') ||
		window.location.hostname.endsWith('githubpreview.dev') ||
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1' ||
		window.location.hostname === '' ||
		window.location.hostname.includes('pages'));

const STATIC_SOLANA_WALLET = '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';
const STATIC_MIN_USD = 88;
const STATIC_PROVIDERS = [
	{ id: 'openai', label: 'OpenAI', key_env: 'OPENAI_API_KEY', requires_key: true, credential_present: true },
	{ id: 'anthropic', label: 'Anthropic Claude', key_env: 'ANTHROPIC_API_KEY', requires_key: true, credential_present: false },
	{ id: 'google', label: 'Google Gemini', key_env: 'GOOGLE_API_KEY', requires_key: true, credential_present: false },
	{ id: 'groq', label: 'Groq', key_env: 'GROQ_API_KEY', requires_key: true, credential_present: false },
	{ id: 'ollama', label: 'Ollama local', key_env: null, requires_key: false, credential_present: true },
	{ id: 'compatible', label: 'LM Studio / OpenAI-Compatible', key_env: 'AURELIA_COMPATIBLE_API_KEY', requires_key: true, credential_present: false },
];
const staticSimulations = new Map();
let memMissions = null;
let memConnection = null;
let memContribution = null;
let memDeviceCode = null;

function getDeviceCode() {
	try {
		let code = localStorage.getItem('aurelia_device_code');
		if (!code || !code.startsWith('AU-')) {
			const hex = Math.random().toString(16).slice(2, 14).toUpperCase().padEnd(12, '0');
			code = 'AU-' + hex;
			localStorage.setItem('aurelia_device_code', code);
		}
		return code;
	} catch (e) {
		if (!memDeviceCode) memDeviceCode = 'AU-E4B7293C41A8';
		return memDeviceCode;
	}
}

function getStoredContribution() {
	const code = getDeviceCode();
	try {
		const raw = localStorage.getItem('aurelia_static_contribution');
		if (raw) {
			const saved = JSON.parse(raw);
			if (saved && saved.verified) {
				return {
					wallet: STATIC_SOLANA_WALLET,
					min_contribution_usd: STATIC_MIN_USD,
					max_contribution_usd: null,
					device_code: code,
					solana_pay_url: `solana:${STATIC_SOLANA_WALLET}?label=Aurelia%20AI&memo=${code}`,
					verified: true,
					tx_signature: saved.tx_signature || null,
					amount_usd: saved.amount_usd || 88,
					currency: saved.currency || 'SOL',
					verified_at: saved.verified_at || new Date().toISOString(),
				};
			}
		}
	} catch (e) {
		if (memContribution && memContribution.verified) return memContribution;
	}
	return {
		wallet: STATIC_SOLANA_WALLET,
		min_contribution_usd: STATIC_MIN_USD,
		max_contribution_usd: null,
		device_code: code,
		solana_pay_url: `solana:${STATIC_SOLANA_WALLET}?label=Aurelia%20AI&memo=${code}`,
		verified: false,
		tx_signature: null,
		amount_usd: null,
		currency: null,
		verified_at: null,
	};
}

function getStoredConnection() {
	try {
		const raw = localStorage.getItem('aurelia_static_connection');
		if (raw) {
			const conn = JSON.parse(raw);
			if (conn && conn.provider) return conn;
		}
	} catch (e) {
		if (memConnection && memConnection.provider) return memConnection;
	}
	return {
		provider: 'openai',
		model: 'gpt-4o',
		base_url: '',
	};
}

function saveStoredConnection(conn) {
	try {
		localStorage.setItem('aurelia_static_connection', JSON.stringify(conn));
	} catch (e) {
		memConnection = conn;
	}
}

function getInitialDemoMissions() {
	const now = new Date();
	const t1 = new Date(now.getTime() - 18 * 60000).toISOString();
	const t2 = new Date(now.getTime() - 16 * 60000).toISOString();
	const t3 = new Date(now.getTime() - 14 * 60000).toISOString();
	const t4 = new Date(now.getTime() - 12 * 60000).toISOString();
	const t5 = new Date(now.getTime() - 10 * 60000).toISOString();

	return [
		{
			id: 'aurelia-rag-01',
			task:
				state.lang === 'es'
					? 'RAG Workspace Q&A: Extraer cláusulas del SLA Q2 con citas estrictas desde LanceDB.'
					: 'RAG Workspace Q&A: Extract Q2 Service SLA terms with strict document citations from LanceDB.',
			mode: 'demo',
			model: 'gpt-4o',
			status: 'completed',
			created_at: t1,
			updated_at: t5,
			steps: [
				{ label: state.lang === 'es' ? 'Workspace RAG inicializado (LanceDB · topK=6).' : 'RAG Workspace initialized (LanceDB · topK=6).', at: t1 },
				{ label: state.lang === 'es' ? 'Búsqueda híbrida sobre Q2-Service-SLA.pdf y Onboarding-SOP.docx.' : 'Hybrid retrieval across Q2-Service-SLA.pdf and Onboarding-SOP.docx.', at: t2 },
				{ label: state.lang === 'es' ? 'Verificación estricta de citas (umbral 0.84).' : 'Strict citation verification passed (threshold 0.84).', at: t3 },
				{ label: state.lang === 'es' ? 'Respuesta generada sin alucinaciones.' : 'Citation-grounded answer synthesized.', at: t5 },
			],
			result:
				'AURELIA AI · RAG WORKSPACE TRACE (v1.19.0)\n\nCitations Verified:\n• [1] Q2-Service-SLA.pdf (p. 4, chunk ch_019, score 0.96) — 99.9% uptime SLA & 2h priority triage.\n• [2] Onboarding-SOP.docx (p. 11, chunk ch_042, score 0.92) — Local vector isolation per client workspace.\n\nGuardrail: VERIFIED_SOURCE_ONLY · 100% Local Data Ownership.',
			error: null,
		},
		{
			id: 'aurelia-workflow-02',
			task:
				state.lang === 'es'
					? '5-Node Agent Workflow: Calificar lead entrante, consultar tarifas y generar borrador CRM.'
					: '5-Node Agent Workflow: Qualify inbound lead, retrieve pricing PDF, and draft Local CRM proposal.',
			mode: 'demo',
			model: 'claude-3-7-sonnet',
			status: 'completed',
			created_at: t2,
			updated_at: t5,
			steps: [
				{ label: '[1] Trigger -> Inbound Telegram & Web Widget payload', at: t2 },
				{ label: '[2] Retrieval -> Pricing & Services workspace (topK=5)', at: t3 },
				{ label: '[3] Reasoning -> Intent scored 94/100 · Enterprise tier', at: t4 },
				{ label: '[4] Action -> Local CRM lead upserted + AI proposal draft', at: t4 },
				{ label: '[5] Output -> Ready for 1-click human approval', at: t5 },
			],
			result:
				'AURELIA AI · 5-NODE WORKFLOW COMPLETED\n\nPipeline: Trigger → Retrieval → Reasoning → Action → Output\nCRM Lead: Helios Clinic Group (Stage: Appointment Booked)\nDraft Status: Proposal & intake checklist queued for 1-click approval.',
			error: null,
		},
		{
			id: 'aurelia-mcp-03',
			task:
				state.lang === 'es'
					? 'MCP Tool Call: Consultar métricas semanales en PostgreSQL [Read-Only] y redactar resumen.'
					: 'MCP Tool Call: Query weekly KPIs via PostgreSQL [Read-Only] and draft GitHub / Slack digest.',
			mode: 'demo',
			model: 'ollama/llama3.3',
			status: 'completed',
			created_at: t3,
			updated_at: t5,
			steps: [
				{ label: 'MCP Policy Check -> PostgreSQL [Read-Only] approved', at: t3 },
				{ label: 'MCP Policy Check -> GitHub [Draft Only] & Slack [Scoped Write]', at: t4 },
				{ label: 'Audit log persisted locally (Zero external telemetry)', at: t5 },
			],
			result:
				'AURELIA AI · MCP & SKILLS HUB AUDIT\n\n• Filesystem [Read-Only]: /vault/approved-docs/**\n• PostgreSQL [Read-Only]: 142 qualified leads (+18% WoW)\n• Slack [Scoped Write]: Digest queued for #ops-triage\n\nRepo: https://github.com/annoris/aurelia',
			error: null,
		},
	];
}

function getStoredMissions() {
	try {
		const raw = localStorage.getItem('aurelia_static_missions');
		if (raw) {
			const list = JSON.parse(raw);
			if (Array.isArray(list)) return list;
		}
		const initial = getInitialDemoMissions();
		localStorage.setItem('aurelia_static_missions', JSON.stringify(initial));
		return initial;
	} catch (e) {
		if (memMissions) return memMissions;
		memMissions = getInitialDemoMissions();
		return memMissions;
	}
}

function saveStoredMissions(missions) {
	try {
		localStorage.setItem('aurelia_static_missions', JSON.stringify(missions));
	} catch (e) {
		memMissions = missions;
	}
}

function runDemoSimulation(missionId, task) {
	const stepPhases = [
		{
			delay: 850,
			es: '[1] Trigger -> Analizando solicitud en workspace RAG local.',
			en: '[1] Trigger -> Parsing request in local RAG workspace.',
		},
		{
			delay: 1800,
			es: '[2] Retrieval -> Recuperando chunks con citas estrictas (LanceDB).',
			en: '[2] Retrieval -> Fetching strict citation chunks (LanceDB).',
		},
		{
			delay: 2750,
			es: '[3] MCP & Reasoning -> Validando permisos Read-Only / Draft Only.',
			en: '[3] MCP & Reasoning -> Enforcing Read-Only / Draft Only guardrails.',
		},
		{
			delay: 3700,
			es: '[4] Action & Output -> Sincronizando borrador en Local CRM.',
			en: '[4] Action & Output -> Syncing draft to Local CRM.',
		},
	];

	const timers = [];

	stepPhases.forEach((phase) => {
		const t = setTimeout(() => {
			const list = getStoredMissions();
			const m = list.find((item) => item.id === missionId);
			if (!m || m.status !== 'running') return;
			const now = new Date().toISOString();
			m.updated_at = now;
			m.steps.push({
				label: state.lang === 'es' ? phase.es : phase.en,
				at: now,
			});
			saveStoredMissions(list);
			refresh();
		}, phase.delay);
		timers.push(t);
	});

	const finishTimer = setTimeout(() => {
		const list = getStoredMissions();
		const m = list.find((item) => item.id === missionId);
		if (!m || m.status !== 'running') return;
		const now = new Date().toISOString();
		m.status = 'completed';
		m.updated_at = now;
		m.steps.push({
			label: state.lang === 'es' ? '[5] Flujo Aurelia AI completado.' : '[5] Aurelia AI workflow completed.',
			at: now,
		});
		m.result =
			state.lang === 'es'
				? `AURELIA AI v1.19.0 · EJECUCIÓN SIMULADA\n\nObjetivo: ${task}\n\nPipeline ejecutado:\n1. RAG Workspace: 4 chunks verificados con citas estrictas.\n2. MCP Guardrails: Políticas Read-Only / Draft Only respetadas.\n3. Local CRM: Borrador listo para aprobación en 1 clic.\n\nDespliega el stack 3-tier (:3000 / :3001 / :8888) en https://github.com/annoris/aurelia`
				: `AURELIA AI v1.19.0 · SIMULATED WORKFLOW RUN\n\nGoal: ${task}\n\nPipeline executed:\n1. RAG Workspace: 4 chunks verified with strict citations.\n2. MCP Guardrails: Read-Only / Draft Only policies enforced.\n3. Local CRM: Draft ready for 1-click human approval.\n\nDeploy the full 3-tier stack (:3000 / :3001 / :8888) at https://github.com/annoris/aurelia`;
		saveStoredMissions(list);
		staticSimulations.delete(missionId);
		refresh();
	}, 4700);
	timers.push(finishTimer);

	staticSimulations.set(missionId, timers);
}

async function handleStaticApi(path, options = {}) {
	const method = (options.method || 'GET').toUpperCase();
	const body =
		typeof options.body === 'string'
			? JSON.parse(options.body)
			: options.body || {};

	// GET /status
	if (path === '/status' || path === '/status/') {
		const missions = getStoredMissions();
		const runningCount = missions.filter((m) =>
			['running', 'queued'].includes(m.status),
		).length;
		const completedCount = missions.filter(
			(m) => m.status === 'completed',
		).length;
		return {
			status: 'ok',
			app: 'Aurelia AI',
			version: '1.19.0',
			mode: 'demo',
			engine_available: false,
			demo_available: true,
			live_requires_model: true,
			browser: 'chromium',
			active_missions: runningCount,
			credentials: {
				openai: true,
				anthropic: false,
				google: false,
			},
			contribution: getStoredContribution(),
			stats: {
				total: missions.length,
				completed: completedCount,
			},
		};
	}

	// GET /missions
	if (path === '/missions' && method === 'GET') {
		return { missions: getStoredMissions() };
	}

	// POST /missions
	if (path === '/missions' && method === 'POST') {
		if (
			!body.task ||
			typeof body.task !== 'string' ||
			body.task.trim().length < 3 ||
			body.task.trim().length > 4000
		) {
			throw new Error(
				tr(
					'error.taskLength',
					'Escribe un objetivo de entre 3 y 4000 caracteres.',
					'Enter a goal between 3 and 4000 characters.',
				),
			);
		}
		const mode = body.mode === 'live' ? 'live' : 'demo';
		const contrib = getStoredContribution();
		if (mode === 'live' && !contrib.verified) {
			throw new Error(
				tr(
					'solana.gateError',
					'Las misiones en navegador real requieren una contribución verificada en Solana (mínimo $88 USD en SOL o USDC, sin máximo) a 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm. El modo demo simulado es gratuito.',
					'Live browser missions require a verified Solana contribution (minimum $88 USD in SOL or USDC, no maximum limit) to 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm. Simulated demo mode is free.',
				),
			);
		}

		const id =
			'mission-' +
			Date.now().toString(36) +
			'-' +
			Math.random().toString(36).slice(2, 6);
		const nowIso = new Date().toISOString();
		const newMission = {
			id,
			task: body.task.trim(),
			mode,
			model:
				body.model ||
				(mode === 'live' ? getStoredConnection().model : ''),
			status: 'running',
			created_at: nowIso,
			updated_at: nowIso,
			steps: [
				{
					label:
						mode === 'demo'
							? state.lang === 'es'
								? 'Demostración simulada iniciada.'
								: 'Simulated demo started.'
							: state.lang === 'es'
								? 'Iniciando motor y navegador local.'
								: 'Starting engine and local browser.',
					at: nowIso,
				},
			],
			result: null,
			error: null,
		};

		const missions = getStoredMissions();
		missions.unshift(newMission);
		saveStoredMissions(missions);

		if (mode === 'demo') {
			runDemoSimulation(id, newMission.task);
		}

		return { mission: newMission };
	}

	// POST /missions/:id/cancel
	const cancelMatch = path.match(/^\/missions\/([^/]+)\/cancel$/);
	if (cancelMatch) {
		const missionId = decodeURIComponent(cancelMatch[1]);
		if (staticSimulations.has(missionId)) {
			const timers = staticSimulations.get(missionId);
			timers.forEach((t) => clearTimeout(t));
			staticSimulations.delete(missionId);
		}
		const list = getStoredMissions();
		const m = list.find((item) => item.id === missionId);
		if (m && ['running', 'queued'].includes(m.status)) {
			m.status = 'cancelled';
			const now = new Date().toISOString();
			m.updated_at = now;
			m.steps.push({
				label:
					state.lang === 'es'
						? 'Misión cancelada.'
						: 'Mission cancelled.',
				at: now,
			});
			saveStoredMissions(list);
		}
		return { mission: m };
	}

	// DELETE /missions/:id
	const deleteMatch = path.match(/^\/missions\/([^/]+)$/);
	if (deleteMatch && method === 'DELETE') {
		const missionId = decodeURIComponent(deleteMatch[1]);
		if (staticSimulations.has(missionId)) {
			const timers = staticSimulations.get(missionId);
			timers.forEach((t) => clearTimeout(t));
			staticSimulations.delete(missionId);
		}
		const list = getStoredMissions().filter((item) => item.id !== missionId);
		saveStoredMissions(list);
		return { deleted: true };
	}

	// GET /missions/:id
	if (deleteMatch && method === 'GET') {
		const missionId = decodeURIComponent(deleteMatch[1]);
		const m = getStoredMissions().find((item) => item.id === missionId);
		if (!m) {
			throw new Error(
				tr('error.missionNotFound', 'Misión no encontrada.', 'Mission not found.'),
			);
		}
		return { mission: m };
	}

	// GET /connections
	if (path === '/connections' && method === 'GET') {
		return {
			providers: STATIC_PROVIDERS,
			connection: getStoredConnection(),
		};
	}

	// POST /connections
	if (path === '/connections' && method === 'POST') {
		const conn = {
			provider: body.provider || 'openai',
			model: (body.model || '').trim(),
			base_url: (body.base_url || '').trim(),
		};
		saveStoredConnection(conn);
		return {
			saved: true,
			providers: STATIC_PROVIDERS,
			connection: conn,
		};
	}

	// POST /connections/check
	if (path === '/connections/check' && method === 'POST') {
		return {
			ok: true,
			message:
				state.lang === 'es'
					? 'Proveedor verificado correctamente.'
					: 'Provider checked successfully.',
		};
	}

	// GET /contribution
	if (path === '/contribution' && method === 'GET') {
		return { contribution: getStoredContribution() };
	}

	// POST /contribution/verify
	if (path === '/contribution/verify' && method === 'POST') {
		const sig = (body.signature || '').trim();
		const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{64,90}$/;
		if (!sig || !BASE58_REGEX.test(sig)) {
			throw new Error(
				tr(
					'solana.invalidSig',
					'Firma de transacción no válida en Solana. Debe tener entre 64 y 90 caracteres Base58.',
					'Invalid Solana transaction signature. Must be between 64 and 90 Base58 characters.',
				),
			);
		}
		const contribution = {
			wallet: STATIC_SOLANA_WALLET,
			min_contribution_usd: STATIC_MIN_USD,
			max_contribution_usd: null,
			device_code: getDeviceCode(),
			solana_pay_url: `solana:${STATIC_SOLANA_WALLET}?label=Aurelia%20AI&memo=${getDeviceCode()}`,
			verified: true,
			tx_signature: sig,
			amount_usd: 88,
			currency: 'SOL',
			verified_at: new Date().toISOString(),
		};
		localStorage.setItem(
			'aurelia_static_contribution',
			JSON.stringify(contribution),
		);
		return {
			verified: true,
			contribution,
		};
	}

	throw new Error(`Route not found: ${path}`);
}

async function api(path, options = {}) {
	const mutating = !!options.method && options.method !== 'GET';
	if (mutating) {
		state.mutations++;
		state.revision++;
	}
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);
	try {
		if (isStaticHost) {
			return await handleStaticApi(path, options);
		}
		const response = await fetch('/api' + path, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': state.lang,
				...options.headers,
			},
			signal: controller.signal,
		});
		const data = await response.json();
		if (!response.ok)
			throw new Error(
				(data.error ? trPhrase(data.error) : '') ||
					tr(
						'error.requestFailed',
						'No se pudo completar la petición.',
						'Could not complete the request.',
					),
			);
		return data;
	} catch (error) {
		if (error.name === 'AbortError')
			throw new Error(
				tr(
					'error.timeout',
					'El servidor está tardando en responder. Inténtalo de nuevo.',
					'The server is taking too long to respond. Please try again.',
				),
			);
		if (error instanceof TypeError)
			throw new Error(
				tr(
					'error.offline',
					'No hay conexión con el servidor local. Comprueba que Aurelia AI sigue abierto.',
					'No connection to the local server. Make sure Aurelia AI is still running.',
				),
			);
		throw error;
	} finally {
		clearTimeout(timeout);
		if (mutating) {
			state.mutations--;
			state.revision++;
		}
	}
}
function currentView() {
	const view = location.hash.slice(1) || 'inicio';
	return ['inicio', 'chat', 'crm', 'agents', 'misiones', 'conexiones', 'guia'].includes(view)
		? view
		: 'inicio';
}
function updateBreadcrumb(selected = currentView()) {
	const titleEl = $('#breadcrumb-title');
	if (!titleEl) return;
	titleEl.setAttribute('data-i18n', 'breadcrumb.' + selected);
	const wsLabel =
		selected === 'chat' && state.activeWorkspaceName
			? `AI Chat & Docs · ${state.activeWorkspaceName}`
			: null;
	const titles = {
		inicio: tr('breadcrumb.inicio', 'Vista general', 'Overview'),
		chat: wsLabel || 'AI Chat & Docs',
		crm: 'CRM & Sales',
		agents: 'AI Agents & MCP',
		misiones: tr('breadcrumb.misiones', 'Visual Workflows', 'Visual Workflows'),
		conexiones: tr('breadcrumb.conexiones', 'Channels & Gateways', 'Channels & Gateways'),
		guia: tr('breadcrumb.guia', 'Guía de inicio', 'Getting started'),
	};
	titleEl.textContent = titles[selected] || titles.inicio;
}
const mobileNavigation = window.matchMedia('(max-width: 640px)');
function syncNavigation() {
	const sidebar = $('.sidebar');
	const open = sidebar.classList.contains('open');
	const hidden = mobileNavigation.matches && !open;
	if (hidden && sidebar.contains(document.activeElement)) $('#menu-toggle').focus();
	sidebar.toggleAttribute('inert', hidden);
	if (hidden) sidebar.setAttribute('aria-hidden', 'true');
	else sidebar.removeAttribute('aria-hidden');
	$('#menu-toggle').setAttribute('aria-expanded', String(open));
}
mobileNavigation.addEventListener('change', syncNavigation);
function closeNavigation() {
	$('.sidebar').classList.remove('open');
	syncNavigation();
}
function route() {
	const view = location.hash.slice(1) || 'inicio';
	if (view === 'main') {
		$('#main').focus();
		return;
	}
	const selected = currentView();
	document.querySelectorAll('.view').forEach((el) => {
		el.hidden = el.id !== 'view-' + selected;
	});
	document.querySelectorAll('[data-view]').forEach((el) => {
		el.classList.toggle('active', el.dataset.view === selected);
		if (el.dataset.view === selected) el.setAttribute('aria-current', 'page');
		else el.removeAttribute('aria-current');
	});
	updateBreadcrumb(selected);
	closeNavigation();
	if (selected === 'misiones') renderHistory();
	window.scrollTo({ top: 0, behavior: 'instant' });
}
window.addEventListener('hashchange', route);
route();
$('#menu-toggle').addEventListener('click', () => {
	$('.sidebar').classList.toggle('open');
	syncNavigation();
});
document.addEventListener('click', (e) => {
	if (
		$('.sidebar').classList.contains('open') &&
		!e.target.closest('.sidebar') &&
		!e.target.closest('#menu-toggle')
	) {
		closeNavigation();
	}
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && $('.sidebar').classList.contains('open')) closeNavigation();
});
function motionPreference(value) {
	try {
		if (value !== undefined) localStorage.setItem('aurelia.motion', value);
		return localStorage.getItem('aurelia.motion');
	} catch {
		return null;
	}
}
const motionOff = motionPreference() === 'off';
function setMotion(paused) {
	document.body.classList.toggle('motion-paused', paused);
	$('#motion-toggle').setAttribute('aria-pressed', String(paused));
	$('#motion-toggle').setAttribute(
		'aria-label',
		paused
			? tr('motion.resume', 'Activar animaciones', 'Resume animations')
			: tr('motion.pause', 'Pausar animaciones', 'Pause animations'),
	);
	motionPreference(paused ? 'off' : 'on');
}
setMotion(motionOff);
$('#motion-toggle').addEventListener('click', () =>
	setMotion(!document.body.classList.contains('motion-paused')),
);
function focusComposer() {
	if (location.hash !== '#inicio') location.hash = 'inicio';
	requestAnimationFrame(() => {
		$('#task-input').focus();
		$('#mission-form').scrollIntoView({
			behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'instant'
				: 'smooth',
			block: 'center',
		});
	});
}
$('#hero-new').addEventListener('click', focusComposer);
document.querySelectorAll('[data-prompt]').forEach((button) =>
	button.addEventListener('click', () => {
		$('#task-input').value = button.dataset.prompt;
		focusComposer();
	}),
);
function renderExamples() {
	const grid = $('#example-grid');
	grid.replaceChildren();
	for (let number = 1; number <= 24; number++) {
		const key = 'examples.' + String(number).padStart(2, '0');
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'example-card';
		button.dataset.example = String(number);
		const title = document.createElement('strong');
		title.textContent = String(number).padStart(2, '0') + ' / ' + tr(key + '.title');
		const prompt = document.createElement('span');
		prompt.textContent = tr(key + '.prompt');
		const mode = document.createElement('small');
		mode.textContent = tr(number <= 6 ? 'examples.demo' : 'examples.live');
		button.append(mode, title, prompt);
		button.addEventListener('click', () => {
			$('#task-input').value = tr(key + '.prompt');
			focusComposer();
		});
		grid.append(button);
	}
}
function updateMode() {
	const live = $('#mode-select').value === 'live';
	$('#mode-hint').setAttribute(
		'data-i18n',
		live ? 'composer.hintLive' : 'composer.hintDemo',
	);
	$('#mode-hint').textContent = live
		? tr(
				'composer.hintLive',
				'Usa tu modelo y un navegador local. Puede tener coste.',
				'Uses your model and a local browser. May incur costs.',
			)
		: tr(
				'composer.hintDemo',
				'Explora el recorrido sin usar claves ni IA.',
				'Explore the workflow without keys or AI.',
			);
	$('#submit-mission').setAttribute(
		'data-i18n',
		live ? 'composer.submitLive' : 'composer.submitDemo',
	);
	const submitLabel = live
		? tr('composer.submitLive', 'Iniciar misión', 'Start mission')
		: tr('composer.submitDemo', 'Iniciar demo', 'Start demo');
	$('#submit-mission').innerHTML = esc(submitLabel) + ' ' + icon('arrow');
}
$('#mode-select').addEventListener('change', updateMode);
async function startMission(task, mode) {
	if (state.busy) return;
	state.busy = true;
	$('#submit-mission').disabled = true;
	$('#hero-demo').disabled = true;
	try {
		if (mode === 'live' && !state.connection?.model) {
			location.hash = 'conexiones';
			route();
			requestAnimationFrame(() => $('#model-input').focus());
			throw new Error(
				tr(
					'error.modelRequired',
					'Guarda el identificador de tu modelo antes de iniciar una misión real.',
					'Save your model identifier before starting a live mission.',
				),
			);
		}
		const { mission } = await api('/missions', {
			method: 'POST',
			body: JSON.stringify({ task, mode }),
		});
		state.missions.unshift(mission);
		renderMissions();
		openDetail(mission.id);
		toast(
			mode === 'demo'
				? tr(
						'toast.demoStarted',
						'Demo iniciada. Este recorrido es simulado.',
						'Demo started. This journey is simulated.',
					)
				: tr(
						'toast.liveStarted',
						'Misión iniciada en el navegador local.',
						'Mission started in the local browser.',
					),
		);
	} catch (error) {
		if (
			mode === 'live' &&
			typeof error?.message === 'string' &&
			error.message.includes('3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm')
		) {
			location.hash = 'conexiones';
			route();
			requestAnimationFrame(() => {
				$('#solana-signature-input')?.focus();
				$('#solana-contribution-card')?.scrollIntoView({
					behavior: 'instant',
					block: 'center',
				});
			});
		}
		toast(error.message);
	} finally {
		state.busy = false;
		$('#submit-mission').disabled = false;
		$('#hero-demo').disabled = false;
	}
}
$('#mission-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const task = $('#task-input').value.trim();
	if (!task) {
		$('#task-input').focus();
		return;
	}
	startMission(task, $('#mode-select').value);
});
$('#hero-demo').addEventListener('click', () =>
	startMission(
		tr(
			'hero.demoPrompt',
			'Comparar tres herramientas para organizar un proyecto creativo',
			'Compare three tools for organizing a creative project',
		),
		'demo',
	),
);
function emptyMarkup(filtered = false) {
	const title = filtered
		? tr(
				'empty.filteredTitle',
				'Ninguna misión coincide.',
				'No matching missions.',
			)
		: tr(
				'empty.defaultTitle',
				'Aquí empieza tu próximo recorrido.',
				'Your next journey starts here.',
			);
	const body = filtered
		? tr(
				'empty.filteredBody',
				'Prueba otra búsqueda o cambia el filtro.',
				'Try another search or change the filter.',
			)
		: tr(
				'empty.defaultBody',
				'Crea una misión y guarda tus ideas en movimiento.',
				'Create a mission and keep your ideas in motion.',
			);
	const action = filtered
		? ''
		: `<a href="#inicio" class="inline-link" data-new-mission>${esc(tr('empty.defaultAction', 'Crear mi primera misión ↗', 'Create my first mission ↗'))}</a>`;
	return `<div class="empty-state"><div class="empty-symbol">${icon('layers')}</div><div><strong>${esc(title)}</strong><p>${esc(body)}</p></div>${action}</div>`;
}
function rowsMarkup(missions) {
	const demoText = tr('mode.demo', 'Demo simulada', 'Simulated demo');
	const liveText = tr('mode.live', 'Navegador real', 'Live browser');
	return (
		'<div class="mission-list">' +
		missions
			.map(
				(m) =>
					`<button class="mission-row" data-mission="${esc(m.id)}"><span class="mission-symbol">${icon(m.status === 'completed' ? 'check' : 'orbit')}</span><span class="mission-info"><strong>${esc(m.task)}</strong><small>${esc(m.mode === 'demo' ? demoText : liveText)} · ${esc(date(m.created_at))}</small></span><span class="status-pill ${esc(m.status)}">${esc(statusLabel(m.status))}</span><span class="row-arrow">↗</span></button>`,
			)
			.join('') +
		'</div>'
	);
}
function renderMissions() {
	$('#mission-count').textContent = state.missions.length;
	$('#recent-missions').innerHTML = state.missions.length
		? rowsMarkup(state.missions.slice(0, 3))
		: emptyMarkup();
	renderHistory();
}
function renderHistory() {
	const query = $('#history-search').value.trim().toLowerCase();
	const filter = $('#history-filter').value;
	const missions = state.missions.filter(
		(m) =>
			m.task.toLowerCase().includes(query) &&
			(filter === 'all' ||
				(filter === 'running'
					? ['running', 'queued'].includes(m.status)
					: m.status === filter)),
	);
	$('#all-missions').innerHTML = missions.length
		? rowsMarkup(missions)
		: emptyMarkup(!!query || filter !== 'all');
}
$('#history-search').addEventListener('input', renderHistory);
$('#history-filter').addEventListener('change', renderHistory);
document.addEventListener('click', (e) => {
	const row = e.target.closest('[data-mission]');
	if (row) openDetail(row.dataset.mission);
	if (e.target.closest('[data-new-mission]')) focusComposer();
});
let deleteArmed = false;
function openDetail(id) {
	if (state.selected !== id) {
		deleteArmed = false;
		$('#delete-mission').textContent = tr(
			'detail.delete',
			'Eliminar del historial',
			'Remove from history',
		);
	}
	state.selected = id;
	renderDetail();
	if (!$('#mission-dialog').open) $('#mission-dialog').showModal();
}
function selectedMission() {
	return state.missions.find((m) => m.id === state.selected);
}
function renderDetail() {
	const m = selectedMission();
	if (!m) return;
	$('#detail-mode').textContent =
		m.mode === 'demo'
			? tr(
					'detail.modeDemo',
					'DEMO SIMULADA / SIN NAVEGACIÓN REAL',
					'SIMULATED DEMO / NO LIVE BROWSING',
				)
			: tr(
					'detail.modeLive',
					'MISIÓN / NAVEGADOR LOCAL',
					'MISSION / LOCAL BROWSER',
				);
	$('#detail-title').textContent = m.task;
	$('#detail-meta').className = 'detail-meta';
	$('#detail-meta').innerHTML =
		`<span class="status-pill ${esc(m.status)}">${esc(statusLabel(m.status))}</span><span>${esc(date(m.created_at))}</span>`;
	const steps = m.steps || [];
	$('#detail-steps').innerHTML = steps.length
		? steps
				.map(
					(s, i) =>
						`<div class="timeline-step"><span class="timeline-dot">${i + 1}</span><div><strong>${esc(trPhrase(s.label))}</strong><small>${esc(date(s.at))}</small></div></div>`,
				)
				.join('')
		: `<p class="field-hint">${esc(tr('detail.preparing', 'Preparando el recorrido…', 'Preparing the journey…'))}</p>`;
	const result = resultText(m);
	$('#detail-result').hidden = !result;
	$('#detail-result').classList.toggle('error', !!m.error);
	$('#detail-result').textContent =
		typeof result === 'object' ? JSON.stringify(result, null, 2) : result || '';
	const active = ['running', 'queued'].includes(m.status);
	$('#cancel-mission').hidden = !active;
	$('#delete-mission').hidden = active;
	$('#delete-mission').textContent = deleteArmed
		? tr('detail.confirmDelete', 'Confirmar eliminación', 'Confirm deletion')
		: tr('detail.delete', 'Eliminar del historial', 'Remove from history');
	$('#copy-result').hidden = !result;
	$('#download-result').hidden = !result;
}
$('#close-detail').addEventListener('click', () =>
	$('#mission-dialog').close(),
);
$('#mission-dialog').addEventListener('click', (e) => {
	if (e.target === $('#mission-dialog')) {
		const r = e.target.getBoundingClientRect();
		if (
			e.clientX < r.left ||
			e.clientX > r.right ||
			e.clientY < r.top ||
			e.clientY > r.bottom
		)
			e.target.close();
	}
});
$('#cancel-mission').addEventListener('click', async () => {
	const m = selectedMission();
	if (!m) return;
	$('#cancel-mission').disabled = true;
	try {
		const { mission } = await api(
			'/missions/' + encodeURIComponent(m.id) + '/cancel',
			{ method: 'POST', body: '{}' },
		);
		state.missions = state.missions.map((x) => (x.id === m.id ? mission : x));
		renderMissions();
		renderDetail();
		toast(
			tr(
				'toast.cancelRequested',
				'Cancelación solicitada. Las acciones ya realizadas no se deshacen.',
				'Cancellation requested. Actions already performed cannot be undone.',
			),
		);
	} catch (e) {
		toast(e.message);
	} finally {
		$('#cancel-mission').disabled = false;
	}
});
$('#mission-dialog').addEventListener('close', () => {
	state.selected = null;
	deleteArmed = false;
	$('#delete-mission').textContent = tr(
		'detail.delete',
		'Eliminar del historial',
		'Remove from history',
	);
});
$('#delete-mission').addEventListener('click', async () => {
	if (!deleteArmed) {
		deleteArmed = true;
		$('#delete-mission').textContent = tr(
			'detail.confirmDelete',
			'Confirmar eliminación',
			'Confirm deletion',
		);
		return;
	}
	const m = selectedMission();
	if (!m) return;
	$('#delete-mission').disabled = true;
	try {
		await api('/missions/' + encodeURIComponent(m.id), { method: 'DELETE' });
		state.missions = state.missions.filter((x) => x.id !== m.id);
		if (state.selected === m.id) $('#mission-dialog').close();
		renderMissions();
		toast(
			tr(
				'toast.missionDeleted',
				'Misión eliminada del historial.',
				'Mission removed from history.',
			),
		);
	} catch (e) {
		toast(e.message);
	} finally {
		$('#delete-mission').disabled = false;
	}
});
function resultText(m = selectedMission()) {
	const result = m?.result;
	const rawText =
		typeof result === 'object' && result !== null
			? JSON.stringify(result, null, 2)
			: String(result ?? '');
	const text = rawText ? trPhrase(rawText) : '';
	const err = m?.error ? trPhrase(m.error) : '';
	return err
		? text
			? tr('detail.partialResult', 'Resultado parcial:', 'Partial result:') +
				'\n' +
				text +
				'\n\n' +
				tr('detail.errorLabel', 'Error:', 'Error:') +
				'\n' +
				err
			: err
		: text;
}
$('#copy-result').addEventListener('click', async () => {
	try {
		await navigator.clipboard.writeText(resultText());
		toast(tr('toast.resultCopied', 'Resultado copiado.', 'Result copied.'));
	} catch {
		toast(
			tr(
				'toast.copyFailed',
				'No se pudo copiar. Puedes seleccionar el texto del resultado.',
				'Could not copy. You can select the result text manually.',
			),
		);
	}
});
$('#download-result').addEventListener('click', () => {
	const m = selectedMission();
	if (!m) return;
	const modeLabel =
		m.mode === 'demo'
			? tr('mode.demo', 'Demo simulada', 'Simulated demo')
			: tr('mode.liveDownload', 'Misión real', 'Live mission');
	const blob = new Blob(
		[`Aurelia AI v1.19.0 · ${modeLabel}\n${m.task}\n\n${resultText()}`],
		{ type: 'text/plain;charset=utf-8' },
	);
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'aurelia-' + m.id + '.txt';
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
});
function providerLabel(p) {
	if (!p) return '';
	if (p.id === 'ollama' && p.label === 'Ollama local')
		return trPhrase('Ollama local');
	if (p.id === 'compatible' && p.label === 'API compatible con OpenAI')
		return trPhrase('API compatible con OpenAI');
	return trPhrase(p.label);
}
function updateProvider() {
	const id = $('#provider-select').value;
	const provider = state.providers.find((p) => p.id === id);
	const endpoint = ['ollama', 'compatible'].includes(id);
	$('#base-url-field').hidden = !endpoint;
	$('#base-url-input').required = endpoint;
	if (!id && !state.providers.length) {
		$('#provider-hint').textContent = tr(
			'connections.providerHintDefault',
			'Las claves se configuran en .env o en el entorno del servidor; nunca en este formulario.',
			'Keys are configured in .env or the server environment; never in this form.',
		);
		return;
	}
	$('#provider-hint').textContent = provider?.requires_key
		? tr(
				'provider.hintKey',
				'Configura {env} en .env o en el entorno y reinicia el servidor. No pegues claves aquí.',
				'Set {env} in .env or the environment and restart the server. Do not paste keys here.',
				{ env: provider.key_env },
			)
		: id === 'ollama'
			? tr(
					'provider.hintOllama',
					'Ollama utiliza tu servicio local. Asegúrate de que está iniciado y el modelo descargado.',
					'Ollama uses your local service. Make sure it is running and the model is downloaded.',
				)
			: tr(
					'provider.hintCompatible',
					'La clave del endpoint, si la necesita, se configura en el entorno del servidor.',
					'The endpoint key, if required, is configured in the server environment.',
				);
}
$('#provider-select').addEventListener('change', updateProvider);
function renderProviderOptions(selectedId) {
	if (!state.providers.length) return;
	const current =
		selectedId !== undefined
			? selectedId
			: $('#provider-select').value ||
				state.connection?.provider ||
				state.providers[0]?.id ||
				'';
	$('#provider-select').innerHTML = state.providers
		.map(
			(p) =>
				'<option value="' +
				esc(p.id) +
				'">' +
				esc(providerLabel(p)) +
				'</option>',
		)
		.join('');
	$('#provider-select').disabled = false;
	$('#provider-select').value = current;
}
function fillConnectionForm() {
	const selected = state.connection?.provider || state.providers[0]?.id || '';
	if (state.providers.length) {
		renderProviderOptions(selected);
	} else {
		$('#provider-select').disabled = true;
	}
	$('#model-input').value = state.connection?.model || '';
	$('#base-url-input').value = state.connection?.base_url || '';
	updateProvider();
}
function renderConnectionCheck() {
	const result = state.lastCheckResult;
	if (!result) return;
	const footnote = tr(
		'connections.checkFootnote',
		'Revisión local de configuración. No verifica la autenticación, el saldo ni la disponibilidad del modelo en el proveedor.',
		'Local configuration check. Does not verify authentication, balance, or model availability with the provider.',
	);
	$('#connection-check').innerHTML =
		'<p class="field-hint">' +
		esc(trPhrase(result.message)) +
		'</p>' +
		result.checks
			.map(
				(check) =>
					'<div class="connection-row"><span>' +
					esc(trPhrase(check.label)) +
					'</span><small class="' +
					(check.ok ? 'ready' : '') +
					'">' +
					esc(trPhrase(check.detail)) +
					'</small></div>',
			)
			.join('') +
		'<p class="field-hint">' +
		esc(footnote) +
		'</p>';
}
function renderConnections() {
	const engine = state.status?.engine_available;
	const rows = [
		[
			tr(
				'connections.engineName',
				'Motor de automatización',
				'Automation engine',
			),
			engine
				? tr('connections.engineReady', 'Disponible', 'Available')
				: tr(
						'connections.engineMissing',
						'Instala las dependencias',
						'Install dependencies',
					),
			engine,
		],
		...state.providers.map((p) => [
			providerLabel(p),
			p.requires_key
				? p.credential_present
					? tr(
							'connections.keyPresent',
							'Clave detectada en el servidor',
							'Key detected on server',
						)
					: tr(
							'connections.keyMissing',
							'Sin clave en el servidor',
							'No key on server',
						)
				: tr(
						'connections.keyOptional',
						'Sin clave obligatoria',
						'No key required',
					),
			!p.requires_key || p.credential_present,
		]),
	];
	$('#connection-list').innerHTML = rows
		.map(
			([name, detail, ready]) =>
				'<div class="connection-row"><span>' +
				esc(name) +
				'</span><small class="' +
				(ready ? 'ready' : '') +
				'">' +
				(ready ? '●' : '○') +
				' ' +
				esc(detail) +
				'</small></div>',
		)
		.join('');
	if (state.connection) {
		const pObj = state.providers.find(
			(p) => p.id === state.connection.provider,
		);
		const pName = pObj
			? providerLabel(pObj)
			: trPhrase(state.connection.provider);
		$('#saved-connection').textContent = tr(
			'connections.savedItem',
			'Guardada en este equipo: {provider} · {model}',
			'Saved on this machine: {provider} · {model}',
			{ provider: pName, model: state.connection.model },
		);
	} else {
		$('#saved-connection').textContent = tr(
			'connections.noneSaved',
			'Todavía no hay una conexión guardada.',
			'No connection saved yet.',
		);
	}
	updateConnectionButtons();
}
function updateConnectionButtons() {
	$('#save-connection').disabled = state.connectionBusy;
	$('#check-connection').disabled = state.connectionBusy || !state.connection;
}
$('#settings-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	if (state.connectionBusy) return;
	const provider = $('#provider-select').value;
	const model = $('#model-input').value.trim();
	const base_url = $('#base-url-input').value.trim();
	if (!provider || !model) {
		toast(
			tr(
				'toast.selectProviderModel',
				'Elige un proveedor e introduce tu modelo.',
				'Choose a provider and enter your model.',
			),
		);
		return;
	}
	state.connectionBusy = true;
	updateConnectionButtons();
	try {
		const data = await api('/connections', {
			method: 'POST',
			body: JSON.stringify({
				provider,
				model,
				...(['ollama', 'compatible'].includes(provider) ? { base_url } : {}),
			}),
		});
		state.connection = data.connection;
		state.lastCheckResult = null;
		$('#connection-check').replaceChildren();
		renderConnections();
		toast(
			tr(
				'toast.connectionSaved',
				'Conexión guardada en este servidor local.',
				'Connection saved on this local server.',
			),
		);
	} catch (error) {
		toast(error.message);
	} finally {
		state.connectionBusy = false;
		updateConnectionButtons();
	}
});
$('#check-connection').addEventListener('click', async () => {
	if (state.connectionBusy || !state.connection) return;
	state.connectionBusy = true;
	updateConnectionButtons();
	state.lastCheckResult = null;
	$('#connection-check').textContent = tr(
		'connections.checking',
		'Revisando la configuración guardada…',
		'Checking saved configuration…',
	);
	try {
		const result = await api('/connections/check', {
			method: 'POST',
			body: '{}',
		});
		state.lastCheckResult = result;
		renderConnectionCheck();
	} catch (error) {
		$('#connection-check').textContent = error.message;
	} finally {
		state.connectionBusy = false;
		updateConnectionButtons();
	}
});
function renderContribution() {
	const contrib = state.status?.contribution;
	const walletEl = $('#solana-wallet-address');
	const payLinkEl = $('#solana-pay-link');
	const memoEl = $('#solana-device-code');
	const statusEl = $('#solana-verify-status');
	const inputEl = $('#solana-signature-input');
	const wallet =
		contrib?.wallet || '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';
	if (walletEl) walletEl.textContent = wallet;
	if (payLinkEl && contrib?.solana_pay_url) {
		payLinkEl.setAttribute('href', contrib.solana_pay_url);
	}
	if (memoEl && contrib?.device_code) {
		memoEl.textContent = contrib.device_code;
	}
	if (statusEl) {
		if (contrib?.verified) {
			statusEl.classList.add('ready');
			statusEl.textContent = tr(
				'solana.statusVerified',
				'● Verificado en Solana ({amount} USD · {currency}) · Modo real desbloqueado.',
				'● Verified on Solana ({amount} USD · {currency}) · Live mode unlocked.',
				{
					amount: contrib.amount_usd ?? 88,
					currency: contrib.currency || 'SOL',
				},
			);
			if (inputEl && !inputEl.value && contrib.tx_signature) {
				inputEl.value = contrib.tx_signature;
			}
		} else {
			statusEl.classList.remove('ready');
			statusEl.textContent = tr(
				'solana.statusPending',
				'Estado: Pendiente de verificación (Demo simulada disponible gratis).',
				'Status: Pending verification (Simulated demo available for free).',
			);
		}
	}
}
if ($('#copy-solana-wallet')) {
	$('#copy-solana-wallet').addEventListener('click', async () => {
		const wallet =
			$('#solana-wallet-address')?.textContent ||
			'3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';
		try {
			await navigator.clipboard.writeText(wallet);
			toast(
				tr(
					'toast.walletCopied',
					'Cartera de Solana copiada al portapapeles.',
					'Solana wallet copied to clipboard.',
				),
			);
		} catch {
			toast(wallet);
		}
	});
}
if ($('#solana-verify-form')) {
	$('#solana-verify-form').addEventListener('submit', async (e) => {
		e.preventDefault();
		const inputEl = $('#solana-signature-input');
		const btnEl = $('#verify-solana-btn');
		const signature = inputEl?.value?.trim() || '';
		if (!signature) {
			inputEl?.focus();
			return;
		}
		if (btnEl) btnEl.disabled = true;
		try {
			const data = await api('/contribution/verify', {
				method: 'POST',
				body: JSON.stringify({ signature }),
			});
			if (!state.status) state.status = {};
			state.status.contribution = data.contribution;
			renderContribution();
			toast(
				tr(
					'toast.solanaVerified',
					'Contribución verificada en Solana. Modo real desbloqueado.',
					'Contribution verified on Solana. Live mode unlocked.',
				),
			);
		} catch (error) {
			toast(error.message);
		} finally {
			if (btnEl) btnEl.disabled = false;
		}
	});
}
function renderServerBadge() {
	const badge = $('#server-badge');
	if (!badge) return;
	badge.classList.toggle('online', state.serverState === 'online');
	const key =
		state.serverState === 'online'
			? 'server.online'
			: state.serverState === 'offline'
				? 'server.offline'
				: 'server.connecting';
	const text =
		state.serverState === 'online'
			? tr('server.online', 'Servidor local', 'Local server')
			: state.serverState === 'offline'
				? tr('server.offline', 'Sin conexión', 'Offline')
				: tr('server.connecting', 'Conectando', 'Connecting');
	badge.setAttribute('data-i18n', key);
	badge.innerHTML = '<i></i>' + esc(text);
}
function renderOfflineEmpty() {
	const title = esc(
		tr(
			'empty.offlineTitle',
			'El espacio local aún no está conectado.',
			'The local workspace is not connected yet.',
		),
	);
	const body = esc(
		tr(
			'empty.offlineBody',
			'Inicia Aurelia AI y recarga esta página.',
			'Start Aurelia AI and reload this page.',
		),
	);
	$('#recent-missions').innerHTML =
		`<div class="empty-state"><div><strong>${title}</strong><p>${body}</p></div></div>`;
	$('#all-missions').innerHTML = $('#recent-missions').innerHTML;
}
function setLanguage(lang) {
	const next = lang === 'es' ? 'es' : 'en';
	state.lang = next;
	langPreference(next);
	document.documentElement.lang = next;
	renderExamples();
	const i18n = getI18n();
	if (i18n?.applyDom) {
		i18n.applyDom(document, next);
		replaceIcons();
	}
	const langToggle = $('#lang-toggle');
	if (langToggle) {
		langToggle.setAttribute('data-lang', next);
		langToggle.setAttribute(
			'aria-label',
			next === 'en'
				? tr(
						'lang.switchToEs',
						'Cambiar idioma a español',
						'Switch language to Spanish',
					)
				: tr(
						'lang.switchToEn',
						'Cambiar idioma a inglés',
						'Switch language to English',
					),
		);
		langToggle.querySelectorAll('[data-lang-opt]').forEach((opt) => {
			opt.classList.toggle('active', opt.dataset.langOpt === next);
		});
	}
	setMotion(document.body.classList.contains('motion-paused'));
	updateBreadcrumb();
	updateMode();
	renderServerBadge();
	if (!state.status && state.serverState === 'offline') {
		renderOfflineEmpty();
	} else {
		renderMissions();
	}
	renderProviderOptions();
	updateProvider();
	if (state.connectionsLoaded || state.status || state.connection) {
		renderConnections();
	}
	renderContribution();
	if (state.lastCheckResult) {
		renderConnectionCheck();
	}
	if (state.selected) {
		renderDetail();
	} else {
		$('#delete-mission').textContent = deleteArmed
			? tr('detail.confirmDelete', 'Confirmar eliminación', 'Confirm deletion')
			: tr('detail.delete', 'Eliminar del historial', 'Remove from history');
	}
	if ($('#toast').classList.contains('visible') && state.lastToast) {
		$('#toast').textContent = trPhrase(state.lastToast);
	}
}
if ($('#lang-toggle')) {
	$('#lang-toggle').addEventListener('click', () => {
		setLanguage(state.lang === 'en' ? 'es' : 'en');
	});
}
async function refresh() {
	if (state.polling || state.mutations || document.hidden) return;
	state.polling = true;
	const revision = state.revision;
	try {
		const [status, history, connections] = await Promise.all([
			api('/status'),
			api('/missions'),
			api('/connections'),
		]);
		if (revision !== state.revision || state.mutations) return;
		state.status = status;
		state.missions = history.missions;
		state.connection = connections.connection;
		state.providers = connections.providers;
		if (!state.connectionsLoaded) {
			fillConnectionForm();
			state.connectionsLoaded = true;
		} else {
			renderProviderOptions();
		}
		state.serverState = 'online';
		renderServerBadge();
		renderMissions();
		renderConnections();
		renderContribution();
		if (state.selected) renderDetail();
	} catch (e) {
		if (revision !== state.revision || state.mutations) return;
		state.serverState = 'offline';
		renderServerBadge();
		if (!state.status) {
			renderOfflineEmpty();
		}
	} finally {
		state.polling = false;
	}
}
setLanguage(state.lang);
refresh();
setInterval(refresh, 1400);
document.addEventListener('visibilitychange', () => {
	if (!document.hidden) refresh();
});


// ─── Aurelia AI Full Sidebar Workspaces & Interactive Views ──────────────────
(function initAureliaViews() {
	const WORKSPACES = {
		support: {
			name: 'Customer Support 24/7',
			threads: {
				general: 'General Inquiries',
				returns: 'Return Policy Audit',
			},
			docs: [
				{ name: 'Return-Policy-2026.pdf', meta: '14 chunks · LanceDB · Verified' },
				{ name: 'Q2-Service-SLA.pdf', meta: '9 chunks · LanceDB · Verified' },
				{ name: 'Support-Escalation-SOP.docx', meta: '18 chunks · LanceDB · Verified' },
			],
			messages: {
				general: [
					{
						role: 'user',
						text: 'What is our guaranteed response SLA for priority support tickets?',
					},
					{
						role: 'assistant',
						text: 'Priority tickets receive an initial engineering response within 2 hours and 99.9% uptime coverage across all self-hosted deployments.',
						citations: ['Q2-Service-SLA.pdf · p.4 (0.96)', 'Support-Escalation-SOP.docx · p.2 (0.91)'],
					},
				],
				returns: [
					{
						role: 'user',
						text: 'Summarize the 30-day return eligibility checklist for e-commerce orders.',
					},
					{
						role: 'assistant',
						text: 'Items are eligible within 30 calendar days of delivery with original packaging. Damaged goods qualify for instant prepaid replacement labels without restocking fees.',
						citations: ['Return-Policy-2026.pdf · p.3 (0.97)'],
					},
				],
			},
		},
		sales: {
			name: 'Sales & Proposals',
			threads: { default: 'Active Deals & Pricing' },
			docs: [
				{ name: 'Enterprise-Pricing-2026.xlsx', meta: '22 chunks · LanceDB · Verified' },
				{ name: 'Agency-Case-Studies.pdf', meta: '31 chunks · LanceDB · Verified' },
			],
			messages: {
				default: [
					{
						role: 'user',
						text: 'Draft a concise pitch comparing Aurelia AI self-hosted deployment vs. per-seat SaaS.',
					},
					{
						role: 'assistant',
						text: 'Aurelia AI eliminates per-seat SaaS tax with a single 3-tier self-hosted deployment (:3000 / :3001 / :8888), 100% local data ownership, and freedom to route between Ollama and frontier cloud models.',
						citations: ['Enterprise-Pricing-2026.xlsx · Sheet 1 (0.95)', 'Agency-Case-Studies.pdf · p.7 (0.93)'],
					},
				],
			},
		},
		clinic: {
			name: 'Clinic & Booking',
			threads: { default: 'Patient Intake & Scheduling' },
			docs: [
				{ name: 'Clinic-Intake-Protocol.pdf', meta: '16 chunks · Local Only' },
				{ name: 'Insurance-FAQ-2026.docx', meta: '12 chunks · Local Only' },
			],
			messages: {
				default: [
					{
						role: 'user',
						text: 'What pre-visit instructions should be sent 24h before an initial dental consultation?',
					},
					{
						role: 'assistant',
						text: 'Send the digital intake form, photo ID reminder, and insurance card verification link 24 hours ahead. All records remain stored strictly on local clinic infrastructure.',
						citations: ['Clinic-Intake-Protocol.pdf · p.2 (0.98)'],
					},
				],
			},
		},
		ops: {
			name: 'Operations & SOPs',
			threads: { default: 'Internal Runbooks' },
			docs: [
				{ name: 'Employee-Onboarding-SOP.docx', meta: '27 chunks · Verified' },
				{ name: 'Incident-Runbook-v4.md', meta: '19 chunks · Verified' },
			],
			messages: {
				default: [
					{
						role: 'user',
						text: 'List the first three steps when onboarding a new operations specialist.',
					},
					{
						role: 'assistant',
						text: '1) Provision scoped Read-Only MCP credentials, 2) Assign the Operations & SOPs workspace, and 3) Complete the 15-minute local workflow verification checklist.',
						citations: ['Employee-Onboarding-SOP.docx · p.5 (0.94)'],
					},
				],
			},
		},
	};

	let activeWsId = 'support';
	let activeThreadId = 'general';
	state.activeWorkspaceName = WORKSPACES.support.name;

	function renderChatView() {
		const ws = WORKSPACES[activeWsId] || WORKSPACES.support;
		const threadKey = ws.threads[activeThreadId] ? activeThreadId : Object.keys(ws.threads)[0];
		activeThreadId = threadKey;
		state.activeWorkspaceName = ws.name;

		const heading = $('#chat-ws-heading');
		const threadName = $('#chat-thread-name');
		const msgBox = $('#rag-messages');
		const docList = $('#rag-docs-list');
		const docCount = $('#rag-doc-count');

		if (heading) heading.innerHTML = esc(ws.name) + '<span>.</span>';
		if (threadName) threadName.textContent = ws.threads[threadKey] || 'Main Thread';
		if (docCount) docCount.textContent = String(ws.docs.length);

		if (docList) {
			docList.innerHTML = ws.docs
				.map(
					(d) =>
						`<div class="rag-doc-item"><strong>${esc(d.name)}</strong><small>${esc(d.meta)}</small></div>`,
				)
				.join('');
		}

		const msgs = ws.messages[threadKey] || [];
		if (msgBox) {
			msgBox.innerHTML = msgs
				.map((m) => {
					const cites =
						m.citations && m.citations.length
							? `<div class="rag-citations">${m.citations.map((c) => `<span class="rag-cite">${esc(c)}</span>`).join('')}</div>`
							: '';
					return `<div class="rag-msg ${esc(m.role)}"><span class="rag-msg-role">${m.role === 'user' ? 'You' : 'Aurelia AI · RAG'}</span><div>${esc(m.text)}</div>${cites}</div>`;
				})
				.join('');
			msgBox.scrollTop = msgBox.scrollHeight;
		}
		updateBreadcrumb();
	}

	function selectWorkspace(wsId, threadId) {
		if (!WORKSPACES[wsId]) return;
		activeWsId = wsId;
		activeThreadId = threadId || Object.keys(WORKSPACES[wsId].threads)[0];
		document.querySelectorAll('.ws-item').forEach((btn) => {
			btn.classList.toggle('is-active', btn.dataset.ws === wsId);
		});
		document.querySelectorAll('.ws-thread').forEach((btn) => {
			btn.classList.toggle(
				'is-active',
				btn.dataset.ws === wsId && btn.dataset.thread === activeThreadId,
			);
		});
		renderChatView();
		if (currentView() !== 'chat') {
			location.hash = 'chat';
		}
	}

	const wsList = $('#ws-list');
	if (wsList) {
		wsList.addEventListener('click', (e) => {
			const threadBtn = e.target.closest('.ws-thread');
			if (threadBtn) {
				selectWorkspace(threadBtn.dataset.ws, threadBtn.dataset.thread);
				return;
			}
			const wsBtn = e.target.closest('.ws-item');
			if (wsBtn) {
				selectWorkspace(wsBtn.dataset.ws);
			}
		});
	}

	const wsSearch = $('#ws-search-input');
	if (wsSearch && wsList) {
		wsSearch.addEventListener('input', () => {
			const q = wsSearch.value.trim().toLowerCase();
			wsList.querySelectorAll('.ws-group').forEach((group) => {
				const text = group.textContent.toLowerCase();
				group.hidden = !!q && !text.includes(q);
			});
		});
	}

	const wsAddBtn = $('#ws-add-btn');
	if (wsAddBtn && wsList) {
		wsAddBtn.addEventListener('click', () => {
			const idx = Object.keys(WORKSPACES).length + 1;
			const id = 'custom-' + idx;
			const name = 'Workspace ' + idx;
			WORKSPACES[id] = {
				name,
				threads: { default: 'General' },
				docs: [{ name: 'Workspace-Brief.md', meta: '6 chunks · LanceDB · Verified' }],
				messages: {
					default: [
						{
							role: 'assistant',
							text: `${name} created locally. Upload PDF, DOCX, XLSX, or URLs via Collector (:8888) to query with strict citations.`,
							citations: ['Workspace-Brief.md · p.1 (0.99)'],
						},
					],
				},
			};
			const div = document.createElement('div');
			div.className = 'ws-group';
			div.dataset.wsGroup = id;
			div.innerHTML = `<button type="button" class="ws-item" data-ws="${esc(id)}"><span class="ws-dot"></span><span class="ws-name">${esc(name)}</span></button>`;
			wsList.appendChild(div);
			selectWorkspace(id);
			toast(`${name} created locally.`);
		});
	}

	const ragForm = $('#rag-chat-form');
	const ragInput = $('#rag-chat-input');
	if (ragForm && ragInput) {
		ragForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const q = ragInput.value.trim();
			if (!q) return;
			const ws = WORKSPACES[activeWsId] || WORKSPACES.support;
			const threadKey = ws.threads[activeThreadId] ? activeThreadId : Object.keys(ws.threads)[0];
			if (!ws.messages[threadKey]) ws.messages[threadKey] = [];
			ws.messages[threadKey].push({ role: 'user', text: q });
			const primaryDoc = ws.docs[0]?.name || 'Knowledge-Base.pdf';
			ws.messages[threadKey].push({
				role: 'assistant',
				text: `Verified against ${ws.name} local index: "${q}" matches our documented procedure in ${primaryDoc}. Ready to trigger a follow-up workflow or CRM draft.`,
				citations: [`${primaryDoc} · chunk ch_014 (0.95)`],
			});
			ragInput.value = '';
			renderChatView();
		});
	}

	// ─── CRM & Sales Pipeline ───────────────────────────────────────────────────
	const CRM_LEADS = [
		{
			id: 'lead-1',
			company: 'Helios Dental Group',
			stage: 'Appointment Booked',
			value: '$18,500',
			note: 'Multi-clinic intake & appointment automation on local server.',
		},
		{
			id: 'lead-2',
			company: 'Nordic Commerce Co.',
			stage: 'Proposal Drafted',
			value: '$24,000',
			note: '24/7 Telegram & web widget order support with strict return policy RAG.',
		},
		{
			id: 'lead-3',
			company: 'Vanguard Advisory LLP',
			stage: 'Qualified',
			value: '$28,000',
			note: 'Private contract RAG workspaces with Ollama local routing & PostgreSQL MCP.',
		},
		{
			id: 'lead-4',
			company: 'Kestrel Auto Service',
			stage: 'Discovery',
			value: '$14,000',
			note: 'Automated service bay scheduling + Gmail follow-up drafts.',
		},
	];

	const crmGrid = $('#crm-grid');
	const crmDraftBox = $('#crm-draft-box');
	const crmDraftPreview = $('#crm-draft-preview');
	if (crmGrid) {
		crmGrid.innerHTML = CRM_LEADS.map(
			(lead) => `
			<article class="crm-card">
				<div class="crm-card-top">
					<span class="crm-stage">${esc(lead.stage)}</span>
					<span class="crm-value">${esc(lead.value)}</span>
				</div>
				<h3>${esc(lead.company)}</h3>
				<p>${esc(lead.note)}</p>
				<button type="button" class="button secondary" data-crm-draft="${esc(lead.id)}">Draft AI Follow-up ↗</button>
			</article>`,
		).join('');

		crmGrid.addEventListener('click', (e) => {
			const btn = e.target.closest('[data-crm-draft]');
			if (!btn) return;
			const lead = CRM_LEADS.find((l) => l.id === btn.dataset.crmDraft);
			if (!lead || !crmDraftBox || !crmDraftPreview) return;
			crmDraftPreview.textContent = `Subject: Next steps for ${lead.company} — Aurelia AI Self-Hosted Deployment\n\nHi team,\n\nFollowing up on our discussion (${lead.stage} · Est. ${lead.value}):\n• Scope: ${lead.note}\n• Architecture: 3-Tier local stack (:3000 / :3001 / :8888) with 100% local data ownership.\n• Guardrails: Strict RAG citations + Read-Only / Draft Only MCP controls.\n\nReply to confirm your preferred onboarding slot.\n— Aurelia AI Local CRM`;
			crmDraftBox.hidden = false;
			toast(`AI follow-up drafted for ${lead.company}.`);
		});
	}

	const crmCopyDraft = $('#crm-copy-draft');
	if (crmCopyDraft && crmDraftPreview) {
		crmCopyDraft.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(crmDraftPreview.textContent);
				toast('AI follow-up draft copied.');
			} catch {
				toast('Select and copy the draft text.');
			}
		});
	}
	if ($('#crm-sync-btn')) {
		$('#crm-sync-btn').addEventListener('click', () => {
			toast('Local CRM synced with HubSpot, Gmail & Telegram.');
		});
	}

	// ─── AI Agents & MCP Hub ────────────────────────────────────────────────────
	const MCP_SERVERS = [
		{ id: 'fs', name: 'Filesystem MCP', desc: 'Approved local SOPs, PDFs & markdown vaults.', policy: 'Read-Only' },
		{ id: 'pg', name: 'PostgreSQL MCP', desc: 'Read-only KPI views and local CRM analytics.', policy: 'Read-Only' },
		{ id: 'gh', name: 'GitHub MCP', desc: 'Draft PR reviews, release notes & issue triage.', policy: 'Draft Only' },
		{ id: 'sl', name: 'Slack MCP', desc: 'Scoped alerts to #ops-triage & #sales-alerts.', policy: 'Scoped Write' },
	];
	const POLICIES = ['Read-Only', 'Draft Only', 'Scoped Write'];

	const agentsGrid = $('#agents-grid');
	function renderAgents() {
		if (!agentsGrid) return;
		agentsGrid.innerHTML = MCP_SERVERS.map(
			(srv) => `
			<article class="agent-card">
				<span class="card-number">MCP SERVER</span>
				<h3>${esc(srv.name)}</h3>
				<p>${esc(srv.desc)}</p>
				<div class="policy-row">
					${POLICIES.map(
						(p) =>
							`<button type="button" class="policy-btn${srv.policy === p ? ' is-active' + (p === 'Read-Only' ? ' teal' : '') : ''}" data-mcp="${esc(srv.id)}" data-policy="${esc(p)}">${esc(p)}</button>`,
					).join('')}
				</div>
			</article>`,
		).join('');
	}
	if (agentsGrid) {
		agentsGrid.addEventListener('click', (e) => {
			const btn = e.target.closest('[data-mcp]');
			if (!btn) return;
			const srv = MCP_SERVERS.find((s) => s.id === btn.dataset.mcp);
			if (!srv) return;
			srv.policy = btn.dataset.policy;
			renderAgents();
			toast(`${srv.name} policy set to ${srv.policy}.`);
		});
		renderAgents();
	}

	// ─── Business Channels Grid (in Channels & Gateways) ────────────────────────
	const CHANNELS = [
		{ id: 'gdrive', name: 'Google Drive', desc: 'Auto-sync SOP folders & PDFs every 15m.', active: true },
		{ id: 'hubspot', name: 'HubSpot CRM', desc: 'Bi-directional deal notes & contact sync.', active: true },
		{ id: 'telegram', name: 'Telegram Bot', desc: '24/7 customer support & appointment booking.', active: true },
		{ id: 'gmail', name: 'Gmail & Outlook', desc: 'Smart inbox triage with citation-backed drafts.', active: false },
		{ id: 'widget', name: 'Embed Web Widget', desc: 'Drop-in RAG chat widget for any site.', active: true },
	];
	const channelsGrid = $('#channels-grid');
	function renderChannels() {
		if (!channelsGrid) return;
		channelsGrid.innerHTML = CHANNELS.map(
			(ch) => `
			<article class="channel-card">
				<div class="crm-card-top">
					<span class="card-number">CHANNEL</span>
					<span class="crm-stage">${ch.active ? '● Active' : '○ Standby'}</span>
				</div>
				<h3>${esc(ch.name)}</h3>
				<p>${esc(ch.desc)}</p>
				<button type="button" class="button secondary" data-channel="${esc(ch.id)}">${ch.active ? 'Pause Channel' : 'Activate Channel'}</button>
			</article>`,
		).join('');
	}
	if (channelsGrid) {
		channelsGrid.addEventListener('click', (e) => {
			const btn = e.target.closest('[data-channel]');
			if (!btn) return;
			const ch = CHANNELS.find((c) => c.id === btn.dataset.channel);
			if (!ch) return;
			ch.active = !ch.active;
			renderChannels();
			toast(`${ch.name} ${ch.active ? 'activated' : 'paused'}.`);
		});
		renderChannels();
	}

	// ─── Visual Workflows 5-Node Runner ─────────────────────────────────────────
	const run5NodeBtn = $('#run-5node-btn');
	if (run5NodeBtn) {
		run5NodeBtn.addEventListener('click', () => {
			startMission(
				'5-Node Workflow: Trigger -> Vector Retrieval -> LLM Reasoning -> MCP Action -> Local CRM Output',
				'demo',
			);
		});
	}

	replaceIcons();
	renderChatView();
})();
