/**
 * Sommaire des services Parentia.
 *
 * Une seule porte d'entrée pour toute l'application : les pages importent
 * depuis « ../services » et n'ont jamais à connaître l'adresse du backend,
 * ni à savoir s'il tourne en local ou en ligne.
 *
 *   import { api, fetchEvenements, notify } from '../services'
 */

// Cœur : client HTTP, détection local / en ligne, session, mode économie
export {
  default as api,
  api as client,
  API_BASE_URL,
  API_ROOT,
  WS_URL,
  LOCAL_ROOT,
  ONLINE_ROOT,
  SITE_URL,
  connexion,
  resoudreApi,
  definirMode,
  modeDemande,
  lireStatut,
  economie,
  basculerEconomie,
  utilisateurCourant,
  idUtilisateurCourant,
  urlApi,
} from './api'

// Domaines fonctionnels
export * from './authService'
export * from './postService'
export * from './resourceService'
export * from './evenementService'
export * from './messageService'
export * from './notificationService'
export * from './adminService'

// Outils d'interface
export { notify, notifyState, closeNotify } from './notify'
export * from './impersonate'
