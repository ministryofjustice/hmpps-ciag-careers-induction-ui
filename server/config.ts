const production = process.env.NODE_ENV === 'production'

const toBoolean = (value: unknown): boolean => {
  return value === 'true'
}

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  displayErrorDetails: !production && get('DISPLAY_ERROR_DETAILS', 'true') === 'true',
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    prisonerSearch: {
      url: get('PRISONER_SEARCH_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_SEARCH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_SEARCH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_SEARCH_TIMEOUT_RESPONSE', 10000))),
    },
    nomisUserRolesApi: {
      url: get('NOMIS_USER_ROLES_API_URL', 'http://localhost:8082', requiredInProduction),
      timeout: {
        response: Number(get('NOMIS_USER_ROLES_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('NOMIS_USER_ROLES_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(),
    },
    curiousApi: {
      url: get('CURIOUS_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('ESWE_PROFILE_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('ESWE_PROFILE_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(),
    },
    educationAndWorkPlanApi: {
      url: get('EDUCATION_AND_WORK_PLAN_API', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('ESWE_PROFILE_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('ESWE_PROFILE_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(),
    },
    manageUsersApi: {
      url: get('MANAGE_USERS_API', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('ESWE_PROFILE_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('ESWE_PROFILE_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(),
    },
    frontendComponents: {
      url: get('COMPONENT_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('COMPONENT_API_URL', 10000)),
        deadline: Number(get('COMPONENT_API_URL', 10000)),
      },
      agent: new AgentConfig(),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  dpsHomeUrl: get('DPS_URL', 'http://localhost:3001/', requiredInProduction),
  learningPlanUrl: get('LEARNING_AND_WORK_PROGRESS_URL', 'http://localhost:3003', requiredInProduction),
  urlParameterPassphrase: get('PASSPHRASE', '', requiredInProduction),
  phaseName: get('SYSTEM_PHASE', '', requiredInProduction),
  googleAnalyticsId: get('GOOGLE_ANALYTICS_ID', '', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  isBeta: get('IS_BETA', 'false'),
  betaHelpUrl: get('BETA_HELP_URL', ''),
  betaFeedbackUrl: get('BETA_FEEDBACK_URL', ''),
  featureToggles: {
    someToggleEnabled: toBoolean(get('SOME_TOGGLE_ENABLED', false)),
  },
}
