package com.ablute.deepsleep.domain

// ==========================================
// FASE C — CONSENTORCHESTRATOR
// ==========================================

class ConsentOrchestrator {

    fun generateConsentPrompt(capability: String): ConsentPromptModel {
        return when (capability) {
            "AUDIO" -> ConsentPromptModel(
                capabilityRequested = capability,
                whyWeAsk = "Ouvir a respiração ajuda a distinguir ressonar de pausas respiratórias graves.",
                accessType = AccessType.RUNTIME_PERMISSION
            )
            "USAGE_STATS" -> ConsentPromptModel(
                capabilityRequested = capability,
                whyWeAsk = "Saber as horas a que agarras no telemóvel dá-nos o teu índice de fricção digital precoce.",
                accessType = AccessType.SPECIAL_APP_ACCESS
            )
            else -> ConsentPromptModel(
                capabilityRequested = capability,
                whyWeAsk = "Acesso necessário para enriquecer a métrica de sono.",
                accessType = AccessType.PLATFORM_OR_FEATURE_AVAILABILITY
            )
        }
    }

    fun getFallbackDisclosure(capability: String): FallbackDisclosureModel {
        return when (capability) {
            "AUDIO" -> FallbackDisclosureModel(
                whatImprovesIfGranted = "Deteção de ressonar e precisão nas pausas acústicas.",
                whatStillWorksIfDenied = "Análise de movimento basal e rastreio de microdespertares por fricção.",
                whatWillBeUnavailable = "Identificação das razões sonoras dos teus despertares e gravações da noite."
            )
            "USAGE_STATS" -> FallbackDisclosureModel(
                whatImprovesIfGranted = "Leitura automática da tua última interação luminosa no ecrã.",
                whatStillWorksIfDenied = "A monitorização acústica e mecânica da qualidade do teu sono na cama.",
                whatWillBeUnavailable = "A correlação rigorosa entre scroll tardio e fragmentação REM."
            )
            else -> FallbackDisclosureModel(
                whatImprovesIfGranted = "Leituras aprofundadas.",
                whatStillWorksIfDenied = "A base comportamental noturna padrão.",
                whatWillBeUnavailable = ""
            )
        }
    }
}
