from fastapi import APIRouter

from app.api.v1 import (
    alarms,
    auth,
    copilot,
    dashboard,
    dcs,
    emissions,
    energy,
    kaizen,
    optimization,
    recommendations,
    reports,
    simulation,
    simulator,
    telemetry,
    whrs,
    process,
    health,
    rca,
    quality,
    production,
    anomaly,
    kaizen_projects,
    loss_tree,
    oee,
    kaizen_db,
    opl,
    standards,
    verification
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["Telemetry"])
api_router.include_router(alarms.router, prefix="/alarms", tags=["Alarms"])
api_router.include_router(energy.router, prefix="/energy", tags=["Energy"])
api_router.include_router(emissions.router, prefix="/emissions", tags=["Emissions"])
api_router.include_router(whrs.router, prefix="/whrs", tags=["WHRS"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(kaizen.router, prefix="/kaizen", tags=["Kaizen Opportunities"])
api_router.include_router(optimization.router, prefix="/optimization", tags=["Optimization"])
api_router.include_router(simulation.router, prefix="/simulation", tags=["Simulation"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["AI Copilot"])
api_router.include_router(dcs.router, prefix="/dcs", tags=["DCS Integration"])
api_router.include_router(simulator.router, prefix="/simulator", tags=["Simulator Control"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])

api_router.include_router(process.router, prefix="/process", tags=["Process Intelligence"])
api_router.include_router(health.router, prefix="/health", tags=["Equipment Health"])
api_router.include_router(rca.router, prefix="/rca", tags=["Root Cause Analysis"])
api_router.include_router(quality.router, prefix="/quality", tags=["Quality"])
api_router.include_router(production.router, prefix="/production", tags=["Production"])
api_router.include_router(anomaly.router, prefix="/anomaly", tags=["Anomaly Detection"])

# New KAIZEN Intelligence Routes
api_router.include_router(kaizen_projects.router)
api_router.include_router(loss_tree.router)
api_router.include_router(oee.router)
api_router.include_router(kaizen_db.router)
api_router.include_router(opl.router)
api_router.include_router(standards.router)
api_router.include_router(verification.router)
