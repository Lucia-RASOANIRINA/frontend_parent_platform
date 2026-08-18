<template>
  <div class="agenda">
    <!-- ───────────────── Bandeau d'ouverture ───────────────── -->
    <header class="hero">
      <div class="halo halo-a" aria-hidden="true"></div>
      <div class="halo halo-b" aria-hidden="true"></div>

      <div class="hero-contenu">
        <span class="eyebrow">{{ t('evenements.agenda') }}</span>
        <h1>{{ title || (conferencesOnly ? t('nav.conferences') : t('evenements.titre')) }}</h1>
        <p class="lead">{{ subtitle || t('evenements.sousTitre') }}</p>

        <div class="stats" v-if="!loading && events.length">
          <span class="stat">
            <strong>{{ stats.total }}</strong>
            {{ conferencesOnly ? t('nav.conferences').toLowerCase() : t('nav.evenements').toLowerCase() }}
          </span>
          <span class="sep" aria-hidden="true"></span>
          <span class="stat">
            <strong>{{ stats.enLigne }}</strong> {{ t('evenements.enLigne').toLowerCase() }}
          </span>
          <span class="sep" aria-hidden="true"></span>
          <span class="stat">
            <strong>{{ stats.gratuits }}</strong> {{ t('evenements.filtres.gratuits').toLowerCase() }}
          </span>
        </div>

        <button v-if="canCreate" class="cta" type="button" @click="openCreate">
          <span class="cta-icone" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
            </svg>
          </span>
          {{ isEducatrice && !isAdmin ? t('evenements.planifierConference') : t('evenements.creer') }}
        </button>
      </div>
    </header>

    <!-- ───────────────── Barre de recherche & filtres ───────────────── -->
    <section class="barre" :aria-label="t('commun.filtrer')">
      <div class="champ-recherche">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path stroke-linecap="round" d="M20 20l-3.5-3.5" />
        </svg>
        <input
          v-model="critere.q"
          type="search"
          :placeholder="t('evenements.filtres.recherche')"
          :aria-label="t('commun.rechercher')"
          @input="rechercheDifferee" />
        <button v-if="critere.q" type="button" class="effacer-champ"
                :aria-label="t('commun.reinitialiser')" @click="critere.q = ''; load()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div class="segments" role="group" :aria-label="t('evenements.filtres.type')">
        <button
          v-for="f in filtresRapides"
          :key="f.cle"
          type="button"
          class="segment"
          :class="{ actif: filtreRapide === f.cle }"
          :aria-pressed="filtreRapide === f.cle"
          @click="appliquerRapide(f.cle)">
          <span class="segment-icone" v-html="f.icone"></span>{{ f.label }}
        </button>
      </div>

      <button type="button" class="bouton-filtres" :class="{ ouvert: avancesOuverts }"
              :aria-expanded="avancesOuverts" @click="avancesOuverts = !avancesOuverts">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        <span class="etiquette-filtres">{{ t('commun.filtrer') }}</span>
        <span v-if="nbFiltresActifs" class="jeton">{{ nbFiltresActifs }}</span>
      </button>
    </section>

    <!-- ───────────────── Filtres avancés ───────────────── -->
    <Transition name="depli">
      <section v-if="avancesOuverts" class="avances" :aria-label="t('evenements.filtres.avances')">
        <div class="grille-avances">
          <label class="champ">
            <span>{{ t('evenements.filtres.region') }}</span>
            <select v-model="critere.region" @change="load()">
              <option value="">{{ t('commun.tout') }}</option>
              <option v-for="r in referentiel.regions" :key="r" :value="r">{{ r }}</option>
            </select>
          </label>

          <label class="champ">
            <span>{{ t('evenements.filtres.ville') }}</span>
            <input v-model="critere.ville" list="villes-mg" :placeholder="t('commun.tout')" @change="load()" />
            <datalist id="villes-mg">
              <option v-for="v in referentiel.villes" :key="v" :value="v"></option>
            </datalist>
          </label>

          <label class="champ">
            <span>{{ t('evenements.filtres.statut') }}</span>
            <select v-model="critere.statut" @change="load()">
              <option value="">{{ t('commun.tout') }}</option>
              <option v-for="s in referentiel.statuts" :key="s" :value="s">{{ t(`evenements.statuts.${s}`) }}</option>
            </select>
          </label>

          <label class="champ">
            <span>{{ t('evenements.filtres.langue') }}</span>
            <select v-model="critere.langue" @change="load()">
              <option value="">{{ t('commun.tout') }}</option>
              <option value="fr">Français</option>
              <option value="mg">Malagasy</option>
              <option value="en">English</option>
            </select>
          </label>

          <label class="champ">
            <span>{{ t('evenements.filtres.du') }}</span>
            <input v-model="critere.du" type="date" @change="load()" />
          </label>

          <label class="champ">
            <span>{{ t('evenements.filtres.au') }}</span>
            <input v-model="critere.au" type="date" @change="load()" />
          </label>

          <label class="champ">
            <span>{{ t('evenements.filtres.tri') }}</span>
            <select v-model="critere.tri" @change="load()">
              <option v-for="o in ['date', 'recent', 'populaire', 'titre']" :key="o" :value="o">
                {{ t(`evenements.filtres.tris.${o}`) }}
              </option>
            </select>
          </label>
        </div>

        <div class="bascules">
          <button type="button" class="bascule" :class="{ actif: critere.placesDisponibles }"
                  :aria-pressed="critere.placesDisponibles"
                  @click="critere.placesDisponibles = !critere.placesDisponibles; load()">
            {{ t('evenements.filtres.disponibles') }}
          </button>
          <button type="button" class="bascule" :class="{ actif: critere.gratuit }"
                  :aria-pressed="critere.gratuit"
                  @click="critere.gratuit = !critere.gratuit; load()">
            {{ t('evenements.filtres.gratuits') }}
          </button>
          <button v-if="user" type="button" class="bascule" :class="{ actif: critere.mesCreations }"
                  :aria-pressed="critere.mesCreations"
                  @click="critere.mesCreations = !critere.mesCreations; load()">
            {{ t('evenements.filtres.mesCreations') }}
          </button>

          <button type="button" class="reinit" @click="effacerFiltres">
            {{ t('evenements.filtres.effacer') }}
          </button>
        </div>
      </section>
    </Transition>

    <p v-if="!loading && !error" class="compte" aria-live="polite">
      {{ events.length }} {{ t('evenements.filtres.resultats') }}
    </p>

    <!-- ───────────────── Chargement (silhouettes) ───────────────── -->
    <section v-if="loading" class="grille" aria-busy="true" :aria-label="t('commun.chargement')">
      <article v-for="n in 3" :key="n" class="carte silhouette">
        <div class="s-tete"><span class="s-date"></span><span class="s-puce"></span></div>
        <span class="s-ligne large"></span>
        <span class="s-ligne"></span>
        <span class="s-ligne courte"></span>
        <div class="s-pied"><span class="s-barre"></span><span class="s-bouton"></span></div>
      </article>
    </section>

    <!-- ───────────────── Erreur ───────────────── -->
    <div v-else-if="error" class="etat erreur" role="alert">
      <span class="etat-rond" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      </span>
      <p>{{ error }}</p>
      <button class="bouton-clair" type="button" @click="load()">{{ t('commun.reessayer') }}</button>
    </div>

    <!-- ───────────────── Vide ───────────────── -->
    <div v-else-if="events.length === 0" class="etat">
      <span class="etat-rond" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
        </svg>
      </span>
      <p>{{ t('evenements.aucun') }}</p>
      <button v-if="nbFiltresActifs || critere.q || filtreRapide" class="bouton-clair" type="button" @click="effacerFiltres">
        {{ t('evenements.filtres.effacer') }}
      </button>
    </div>

    <!-- ───────────────── Grille ───────────────── -->
    <section v-else class="grille">
      <article
        v-for="ev in events"
        :key="ev.id"
        class="carte"
        :class="[ev.type, { annule: ev.annule, passe: ev.statut === 'TERMINE', online: ev.online }]">

        <span class="ruban" aria-hidden="true"></span>

        <div class="carte-tete">
          <div class="date" :aria-label="ev.date">
            <span class="mois">{{ monthOf(ev.date) }}</span>
            <span class="jour">{{ dayOf(ev.date) }}</span>
          </div>

          <div class="puces">
            <span class="puce type">{{ typeLabel(ev.type) }}</span>
            <span v-if="ev.online" class="puce enligne">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>
              {{ t('evenements.enLigne') }}
            </span>
            <span v-if="ev.annule" class="puce alerte">{{ t('evenements.annule') }}</span>
            <span v-else-if="ev.statut === 'AUJOURDHUI'" class="puce aujourdhui">
              <span class="pulse" aria-hidden="true"></span>{{ t('evenements.statuts.AUJOURDHUI') }}
            </span>
            <span v-else-if="ev.statut === 'TERMINE'" class="puce passee">{{ t('evenements.statuts.TERMINE') }}</span>
            <span v-if="!ev.publie" class="puce brouillon">{{ t('evenements.brouillon') }}</span>
          </div>
        </div>

        <h3 class="titre">{{ ev.titre }}</h3>
        <p class="resume">{{ ev.description }}</p>
        <p v-if="ev.annule && ev.motifAnnulation" class="motif">{{ ev.motifAnnulation }}</p>

        <ul class="infos">
          <li v-if="ev.heureDebut">
            <span class="pastille" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" d="M12 7v5l3 2" /></svg>
            </span>
            {{ ev.heureDebut }}<template v-if="ev.heureFin"> — {{ ev.heureFin }}</template>
          </li>
          <li>
            <span class="pastille" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
            </span>
            {{ lieuComplet(ev) }}
          </li>
          <li v-if="ev.animateur">
            <span class="pastille" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4" /><path stroke-linecap="round" d="M4 21c0-3.314 3.582-6 8-6s8 2.686 8 6" /></svg>
            </span>
            {{ ev.animateur }}
          </li>
          <li :class="{ gratuit: !ev.prix }">
            <span class="pastille" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
            </span>
            {{ ev.prix ? formatPrix(ev.prix) : t('commun.gratuit') }}
          </li>
        </ul>

        <div class="places">
          <div class="jauge" role="progressbar" :aria-valuenow="fillPct(ev)" aria-valuemin="0" aria-valuemax="100">
            <span class="remplissage" :class="{ tendu: ev.placesRestantes <= 3 }" :style="{ width: fillPct(ev) + '%' }"></span>
          </div>
          <span class="places-texte" :class="{ tendu: ev.placesRestantes <= 3 }">
            <strong>{{ ev.placesRestantes }}</strong> / {{ ev.capacite }} {{ t('evenements.places') }}
          </span>
        </div>

        <footer class="actions">
          <div class="actions-secondaires">
            <a :href="urlCalendrier(ev.id)" class="rond" :title="t('evenements.calendrier')"
               :aria-label="t('evenements.calendrier')" download>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /></svg>
            </a>
            <!-- Visio dont le lien n'est pas accessible : on explique au lieu de laisser croire
                 que la réunion est ouverte à tous -->
            <button v-if="visioVerrouillee(ev)" type="button" class="rond verrou"
                    :title="t('evenements.visioReservee')" :aria-label="t('evenements.visioReservee')"
                    @click="expliquerVisio()">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="4" y="11" width="16" height="9" rx="2" /><path stroke-linecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </button>

            <button type="button" class="rond" :title="t('commun.partager')"
                    :aria-label="t('commun.partager')" @click="partager(ev)">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342a3 3 0 1 0 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 0 5.367-2.684 3 3 0 0 0-5.367 2.684zm0 12a3 3 0 1 0 5.367 2.684 3 3 0 0 0-5.367-2.684z" /></svg>
            </button>

            <template v-if="canManageEvent(ev)">
              <button type="button" class="rond" :title="t('evenements.participants')"
                      :aria-label="t('evenements.participants')" @click="ouvrirParticipants(ev)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
              </button>
              <button type="button" class="rond" :title="t('commun.modifier')"
                      :aria-label="t('commun.modifier')" @click="openEdit(ev)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828z" /></svg>
              </button>
              <button type="button" class="rond" :title="t('evenements.dupliquer')"
                      :aria-label="t('evenements.dupliquer')" @click="ouvrirDuplication(ev)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" /></svg>
              </button>
              <button v-if="!ev.annule" type="button" class="rond alerte" :title="t('evenements.annuler')"
                      :aria-label="t('evenements.annuler')" @click="ouvrirAnnulation(ev)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" d="M5.6 5.6l12.8 12.8" /></svg>
              </button>
              <button v-else type="button" class="rond" :title="t('evenements.reactiver')"
                      :aria-label="t('evenements.reactiver')" @click="reactiver(ev)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M20 9A8 8 0 0 0 6.3 6.3M4 15a8 8 0 0 0 13.7 2.7" /></svg>
              </button>
              <button type="button" class="rond danger" :title="t('commun.supprimer')"
                      :aria-label="t('commun.supprimer')" @click="askDelete(ev)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" /></svg>
              </button>
            </template>
          </div>

          <a v-if="ev.online && ev.meetingUrl && !ev.annule && (ev.estInscrit || canManageEvent(ev))"
             :href="ev.meetingUrl" target="_blank" rel="noopener" class="principal visio">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>
            {{ t('evenements.rejoindre') }}
          </a>

          <button v-else-if="!canManageEvent(ev)"
            type="button"
            class="principal"
            :class="{ inscrit: ev.estInscrit, indisponible: ev.annule || ev.statut === 'TERMINE' || (!ev.estInscrit && ev.placesRestantes <= 0) }"
            :disabled="busyId === ev.id || ev.annule
              || (ev.statut === 'TERMINE' && !ev.estInscrit)
              || (!ev.estInscrit && ev.placesRestantes <= 0)"
            @click="toggleInscription(ev)">
            <span v-if="busyId === ev.id" class="mini-spin" aria-hidden="true"></span>
            <template v-else-if="ev.annule">{{ t('evenements.annule') }}</template>
            <template v-else-if="ev.estInscrit">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              {{ t('evenements.inscrit') }}
            </template>
            <template v-else-if="ev.statut === 'TERMINE'">{{ t('evenements.statuts.TERMINE') }}</template>
            <template v-else-if="ev.placesRestantes <= 0">{{ t('evenements.complet') }}</template>
            <template v-else>{{ t('evenements.sinscrire') }}</template>
          </button>
        </footer>
      </article>
    </section>

    <!-- ───────────────── Modale création / édition ───────────────── -->
    <div v-if="formOpen" class="voile" @click.self="formOpen = false">
      <div class="modale" role="dialog" aria-modal="true"
           :aria-label="editing ? t('evenements.modifier') : t('evenements.nouveau')">
        <header class="modale-tete">
          <h2>{{ editing ? t('evenements.modifier') : (isEducatrice && !isAdmin ? t('evenements.planifierConference') : t('evenements.nouveau')) }}</h2>
          <button type="button" class="fermer" :aria-label="t('commun.fermer')" @click="formOpen = false">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <form @submit.prevent="submitForm" class="formulaire">
          <label class="pleine">{{ t('evenements.champs.titre') }}
            <input v-model="form.titre" required :placeholder="t('evenements.champs.titre')" />
          </label>
          <label class="pleine">{{ t('evenements.champs.description') }}
            <textarea v-model="form.description" rows="3" :placeholder="t('evenements.champs.description')"></textarea>
          </label>
          <label>{{ t('evenements.champs.type') }}
            <select v-model="form.type" :disabled="isEducatrice && !isAdmin">
              <option v-if="isAdmin" value="atelier">{{ t('evenements.types.atelier') }}</option>
              <option value="conference">{{ t('evenements.types.conference') }}</option>
              <option v-if="isAdmin" value="rencontre">{{ t('evenements.types.rencontre') }}</option>
              <option v-if="isAdmin" value="webinaire">{{ t('evenements.types.webinaire') }}</option>
            </select>
          </label>
          <label>{{ t('evenements.champs.date') }}
            <input v-model="form.date" type="date" required />
          </label>
          <label>{{ t('evenements.champs.heureDebut') }}
            <input v-model="form.heureDebut" placeholder="10h00" />
          </label>
          <label>{{ t('evenements.champs.heureFin') }}
            <input v-model="form.heureFin" placeholder="11h30" />
          </label>
          <label>{{ t('evenements.champs.region') }}
            <select v-model="form.region">
              <option value="">—</option>
              <option v-for="r in referentiel.regions" :key="r" :value="r">{{ r }}</option>
            </select>
          </label>
          <label>{{ t('evenements.champs.ville') }}
            <input v-model="form.ville" list="villes-mg-form" :placeholder="t('evenements.phVille')" />
            <datalist id="villes-mg-form">
              <option v-for="v in referentiel.villes" :key="v" :value="v"></option>
            </datalist>
          </label>
          <label>{{ t('evenements.champs.lieu') }}
            <input v-model="form.lieu" :placeholder="t('evenements.champs.lieu')" :disabled="form.online" />
          </label>
          <label>{{ t('evenements.champs.animateur') }}
            <input v-model="form.animateur" :placeholder="t('evenements.champs.animateur')" />
          </label>
          <label>{{ t('evenements.champs.capacite') }}
            <input v-model.number="form.capacite" type="number" min="1" :max="form.online ? 4 : undefined" />
          </label>
          <label>{{ t('evenements.champs.prix') }}
            <input v-model.number="form.prix" type="number" min="0" step="500" placeholder="0" />
          </label>
          <label>{{ t('evenements.champs.langue') }}
            <select v-model="form.langue">
              <option value="fr">Français</option>
              <option value="mg">Malagasy</option>
              <option value="en">English</option>
            </select>
          </label>
          <label class="pleine">{{ t('evenements.champs.tags') }}
            <input v-model="form.tags" :placeholder="t('evenements.phTags')" />
          </label>

          <label class="pleine option-case" v-if="form.type === 'conference'">
            <input type="checkbox" v-model="form.online" :disabled="isEducatrice && !isAdmin" />
            <span>{{ t('evenements.champs.visio') }}</span>
          </label>

          <label class="pleine option-case" v-if="isAdmin">
            <input type="checkbox" v-model="form.publie" />
            <span>{{ t('evenements.champs.publie') }}</span>
          </label>

          <p v-if="formError" class="erreur-form pleine" role="alert">{{ formError }}</p>
          <div class="modale-actions pleine">
            <button type="button" class="clair" @click="formOpen = false">{{ t('commun.annuler') }}</button>
            <button type="submit" class="plein" :disabled="saving">
              {{ saving ? t('commun.enregistrement') : (editing ? t('commun.enregistrer') : t('commun.creer')) }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ───────────────── Suppression ───────────────── -->
    <div v-if="deleteTarget" class="voile" @click.self="deleteTarget = null">
      <div class="modale etroite" role="alertdialog" aria-modal="true">
        <span class="modale-rond danger" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" /></svg>
        </span>
        <h3>{{ t('evenements.confirmerSuppression') }}</h3>
        <p>« {{ deleteTarget.titre }} » {{ t('evenements.supprimeDefinitivement') }}</p>
        <div class="modale-actions">
          <button type="button" class="clair" @click="deleteTarget = null">{{ t('commun.annuler') }}</button>
          <button type="button" class="danger" @click="confirmDelete">{{ t('commun.supprimer') }}</button>
        </div>
      </div>
    </div>

    <!-- ───────────────── Annulation ───────────────── -->
    <div v-if="annulTarget" class="voile" @click.self="annulTarget = null">
      <div class="modale etroite" role="dialog" aria-modal="true">
        <h3>{{ t('evenements.annuler') }}</h3>
        <p>« {{ annulTarget.titre }} »</p>
        <label class="champ-modale">{{ t('evenements.motifAnnulation') }}
          <textarea v-model="motifAnnulation" rows="3" :placeholder="t('evenements.phMotif')"></textarea>
        </label>
        <div class="modale-actions">
          <button type="button" class="clair" @click="annulTarget = null">{{ t('commun.annuler') }}</button>
          <button type="button" class="danger" @click="confirmerAnnulation">{{ t('evenements.annuler') }}</button>
        </div>
      </div>
    </div>

    <!-- ───────────────── Duplication ───────────────── -->
    <div v-if="dupTarget" class="voile" @click.self="dupTarget = null">
      <div class="modale etroite" role="dialog" aria-modal="true">
        <h3>{{ t('evenements.dupliquer') }}</h3>
        <p>« {{ dupTarget.titre }} »</p>
        <label class="champ-modale">{{ t('evenements.champs.date') }}
          <input v-model="dupDate" type="date" />
        </label>
        <div class="modale-actions">
          <button type="button" class="clair" @click="dupTarget = null">{{ t('commun.annuler') }}</button>
          <button type="button" class="plein" @click="confirmerDuplication">{{ t('evenements.dupliquer') }}</button>
        </div>
      </div>
    </div>

    <!-- ───────────────── Participants ───────────────── -->
    <div v-if="participantsTarget" class="voile" @click.self="participantsTarget = null">
      <div class="modale" role="dialog" aria-modal="true">
        <header class="modale-tete">
          <h2>{{ t('evenements.participants') }}</h2>
          <button type="button" class="fermer" :aria-label="t('commun.fermer')" @click="participantsTarget = null">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>
        <p class="sous-titre-modale">
          « {{ participantsTarget.titre }} » — {{ participants.length }} / {{ participantsTarget.capacite }}
        </p>
        <ul v-if="participants.length" class="liste-participants">
          <li v-for="p in participants" :key="p.id">
            <span class="jeton-avatar" aria-hidden="true">{{ (p.userNom || '?').charAt(0).toUpperCase() }}</span>
            <span class="nom">{{ p.userNom }}</span>
            <time>{{ new Date(p.createdAt).toLocaleDateString('fr-FR') }}</time>
          </li>
        </ul>
        <p v-else class="sous-titre-modale">{{ t('commun.aucunResultat') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  fetchEvenements, fetchConferences, fetchFiltres, createEvenement, updateEvenement,
  deleteEvenement, annulerEvenement, reactiverEvenement, dupliquerEvenement,
  urlCalendrier, inscrireEvenement, desinscrireEvenement, fetchInscriptions,
  utilisateurCourant, SITE_URL,
} from '../services'
import { notify } from '../services/notify'
import { t } from '../i18n'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  /** Inclure les évènements non publiés (espace administration). */
  showAll: { type: Boolean, default: false },
  /** Espace dédié aux conférences. */
  conferencesOnly: { type: Boolean, default: false },
})

// --- Rôle & permissions ---
const user = utilisateurCourant()
const role = user?.role || null
const isAdmin = computed(() => role === 'ADMIN')
const isEducatrice = computed(() => role === 'EDUCATEUR')
const canCreate = computed(() => isAdmin.value || isEducatrice.value)

function canManageEvent(ev) {
  if (isAdmin.value) return true
  if (isEducatrice.value && ev.createdById && user && ev.createdById === user.id) return true
  return false
}

// --- Données ---
const events = ref([])
const loading = ref(true)
const error = ref('')
const busyId = ref(null)
const avancesOuverts = ref(false)

const referentiel = reactive({ regions: [], villes: [], statuts: ['A_VENIR', 'AUJOURDHUI', 'TERMINE', 'ANNULE'] })

const critere = reactive({
  q: '', type: '', region: '', ville: '', langue: '', statut: '',
  online: undefined, placesDisponibles: false, gratuit: false,
  mesInscriptions: false, mesCreations: false,
  du: '', au: '', tri: 'date',
})

const stats = computed(() => ({
  total: events.value.length,
  enLigne: events.value.filter(e => e.online).length,
  gratuits: events.value.filter(e => !e.prix).length,
}))

const nbFiltresActifs = computed(() => {
  let n = 0
  if (critere.region) n++
  if (critere.ville) n++
  if (critere.langue) n++
  if (critere.statut) n++
  if (critere.du) n++
  if (critere.au) n++
  if (critere.placesDisponibles) n++
  if (critere.gratuit) n++
  if (critere.mesCreations) n++
  if (critere.tri !== 'date') n++
  return n
})

// --- Filtres rapides ---
const ICON_ALL = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>'
const ICON_ATELIER = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828z"/></svg>'
const ICON_CONF = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 8a6 6 0 0 1-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1 1 18 8z"/></svg>'
const ICON_VISIO = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>'
const ICON_MOI = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'

const filtreRapide = ref('')

const filtresRapides = computed(() => {
  const base = [{ cle: '', label: t('commun.tout'), icone: ICON_ALL }]
  if (!props.conferencesOnly) {
    base.push({ cle: 'atelier', label: t('evenements.types.atelier'), icone: ICON_ATELIER })
    base.push({ cle: 'conference', label: t('evenements.types.conference'), icone: ICON_CONF })
  }
  base.push({ cle: 'online', label: t('evenements.enLigne'), icone: ICON_VISIO })
  if (user) base.push({ cle: 'inscrit', label: t('evenements.filtres.mesInscriptions'), icone: ICON_MOI })
  return base
})

function appliquerRapide(cle) {
  filtreRapide.value = cle
  critere.type = ''
  critere.online = undefined
  critere.mesInscriptions = false
  if (cle === 'atelier' || cle === 'conference') critere.type = cle
  else if (cle === 'online') critere.online = true
  else if (cle === 'inscrit') critere.mesInscriptions = true
  load()
}

function effacerFiltres() {
  Object.assign(critere, {
    q: '', type: '', region: '', ville: '', langue: '', statut: '',
    online: undefined, placesDisponibles: false, gratuit: false,
    mesInscriptions: false, mesCreations: false, du: '', au: '', tri: 'date',
  })
  filtreRapide.value = ''
  load()
}

let minuteurRecherche = null
function rechercheDifferee() {
  clearTimeout(minuteurRecherche)
  minuteurRecherche = setTimeout(load, 350)
}

// --- Affichage ---
const MOIS = {
  fr: ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'],
  mg: ['JAN', 'FEB', 'MAR', 'APR', 'MEY', 'JON', 'JOL', 'AOG', 'SEP', 'OKT', 'NOV', 'DES'],
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
}
const dayOf = (d) => (d ? String(new Date(d).getDate()).padStart(2, '0') : '--')
const monthOf = (d) => {
  if (!d) return ''
  const liste = MOIS[document.documentElement.lang] || MOIS.fr
  return liste[new Date(d).getMonth()]
}
const typeLabel = (type) => t(`evenements.types.${type}`) || type
const formatPrix = (p) => `${new Intl.NumberFormat('fr-MG').format(p)} Ar`
const lieuComplet = (ev) => [ev.lieu, ev.ville, ev.region].filter(Boolean).join(' · ') || '—'
const fillPct = (ev) => {
  const cap = ev.capacite || 0
  if (!cap) return 0
  return Math.min(100, Math.round(((cap - ev.placesRestantes) / cap) * 100))
}

function showToast(msg, type = 'success') {
  if (type === 'error') notify.error('Oups', msg)
  else notify.success(t('evenements.cestFait'), msg)
}

// --- Chargement ---
async function load() {
  loading.value = true
  error.value = ''
  try {
    const params = { all: props.showAll, ...critere }
    events.value = props.conferencesOnly
      ? await fetchConferences(params)
      : await fetchEvenements(params)
  } catch {
    error.value = t('evenements.erreurChargement')
  } finally {
    loading.value = false
  }
}

async function chargerReferentiel() {
  try {
    const data = await fetchFiltres(props.showAll)
    referentiel.regions = data.regions || []
    referentiel.villes = data.villes || []
    referentiel.statuts = data.statuts || referentiel.statuts
  } catch { /* les filtres avancés restent utilisables sans le référentiel */ }
}

// --- Inscription ---
async function toggleInscription(ev) {
  if (!user) {
    notify.visitor(t('evenements.rejoindreAteliers'))
    return
  }
  busyId.value = ev.id
  try {
    const res = ev.estInscrit ? await desinscrireEvenement(ev.id) : await inscrireEvenement(ev.id)
    if (res.evenement) Object.assign(ev, res.evenement)
    showToast(ev.estInscrit ? 'Inscription confirmée ✓' : 'Désinscription effectuée')
  } catch (e) {
    showToast(e.response?.data?.error || t('evenements.actionImpossible'), 'error')
  } finally {
    busyId.value = null
  }
}

// --- Formulaire ---
const formOpen = ref(false)
const editing = ref(false)
const saving = ref(false)
const formError = ref('')
const emptyForm = () => ({
  titre: '', description: '',
  type: props.conferencesOnly || (isEducatrice.value && !isAdmin.value) ? 'conference' : 'atelier',
  date: '', heureDebut: '', heureFin: '', lieu: '', region: '', ville: '',
  animateur: user?.nom || '', capacite: 20, prix: 0, langue: 'fr', tags: '',
  online: isEducatrice.value && !isAdmin.value, meetingUrl: '', publie: true, id: null,
})
const form = ref(emptyForm())

function openCreate() {
  editing.value = false
  formError.value = ''
  form.value = emptyForm()
  formOpen.value = true
}

function openEdit(ev) {
  editing.value = true
  formError.value = ''
  form.value = { ...ev }
  formOpen.value = true
}

async function submitForm() {
  if (!form.value.titre || !form.value.date) {
    formError.value = t('commun.obligatoire')
    return
  }
  if (isEducatrice.value && !isAdmin.value) {
    form.value.type = 'conference'
    form.value.online = true
  }
  if (form.value.online) {
    form.value.type = 'conference'
    if (!form.value.capacite || form.value.capacite > 4) form.value.capacite = 4
  }
  saving.value = true
  try {
    if (editing.value) {
      await updateEvenement(form.value.id, form.value)
      showToast(t('evenements.misAJour'))
    } else {
      await createEvenement(form.value)
      showToast(form.value.online ? 'Conférence en ligne planifiée ✓' : 'Évènement créé ✓')
    }
    formOpen.value = false
    await load()
  } catch (e) {
    formError.value = e.response?.data?.error || "Enregistrement impossible."
  } finally {
    saving.value = false
  }
}

// --- Suppression ---
const deleteTarget = ref(null)
const askDelete = (ev) => { deleteTarget.value = ev }
async function confirmDelete() {
  try {
    await deleteEvenement(deleteTarget.value.id)
    showToast(t('evenements.supprime'))
    deleteTarget.value = null
    await load()
  } catch {
    showToast(t('evenements.suppressionImpossible'), 'error')
  }
}

// --- Annulation ---
const annulTarget = ref(null)
const motifAnnulation = ref('')
function ouvrirAnnulation(ev) {
  annulTarget.value = ev
  motifAnnulation.value = ''
}
async function confirmerAnnulation() {
  try {
    await annulerEvenement(annulTarget.value.id, motifAnnulation.value)
    showToast(t('evenements.annule'))
    annulTarget.value = null
    await load()
  } catch {
    showToast(t('evenements.annulationImpossible'), 'error')
  }
}

async function reactiver(ev) {
  try {
    await reactiverEvenement(ev.id)
    showToast(t('evenements.reactive'))
    await load()
  } catch {
    showToast(t('evenements.actionImpossible'), 'error')
  }
}

// --- Duplication ---
const dupTarget = ref(null)
const dupDate = ref('')
function ouvrirDuplication(ev) {
  dupTarget.value = ev
  const base = ev.date ? new Date(ev.date) : new Date()
  base.setDate(base.getDate() + 7)
  dupDate.value = base.toISOString().slice(0, 10)
}
async function confirmerDuplication() {
  try {
    await dupliquerEvenement(dupTarget.value.id, dupDate.value)
    showToast(t('evenements.copieCreee'))
    dupTarget.value = null
    await load()
  } catch {
    showToast(t('evenements.duplicationImpossible'), 'error')
  }
}

// --- Participants ---
const participantsTarget = ref(null)
const participants = ref([])
async function ouvrirParticipants(ev) {
  participantsTarget.value = ev
  participants.value = []
  try {
    participants.value = await fetchInscriptions(ev.id)
  } catch { /* liste vide */ }
}

// --- Réunion en ligne ---

/**
 * Le serveur ne transmet le lien de visio qu'aux inscrits, à l'organisateur et
 * à l'administration. Sans lien sur un évènement en ligne, l'accès est donc
 * verrouillé pour la personne qui consulte.
 */
function visioVerrouillee(ev) {
  return ev.online && !ev.annule && !ev.meetingUrl && ev.statut !== 'TERMINE'
}

/** Explique pourquoi la réunion n'est pas accessible — même message que partout ailleurs. */
function expliquerVisio() {
  if (!user) {
    notify.visitor(t('evenements.visioVisiteurTexte'))
    return
  }
  notify.info(t('evenements.visioReservee'), t('evenements.visioInscritsTexte'))
}

// --- Partage ---
async function partager(ev) {
  const texte = `${ev.titre} — ${ev.date}${ev.heureDebut ? ' à ' + ev.heureDebut : ''} (${lieuComplet(ev)})`
  const lien = `${SITE_URL}/evenements`
  if (navigator.share) {
    try {
      await navigator.share({ title: ev.titre, text: texte, url: lien })
      return
    } catch { /* partage annulé par l'utilisateur */ }
  }
  try {
    await navigator.clipboard.writeText(`${texte}\n${lien}`)
    showToast(t('commun.copie'))
  } catch {
    showToast(lien)
  }
}

onMounted(() => {
  if (props.conferencesOnly) critere.type = 'conference'
  load()
  chargerReferentiel()
})
</script>

<style scoped>
/* ══════════════ Repères ══════════════ */
.agenda {
  --sable: #C19A6B;
  --brun: #6F4E37;
  --brun-fonce: #3E2C1F;
  --creme: #FBF7F1;
  --bord: #EFE7DC;
  --doux: #6b5d4f;
  --discret: #a99e90;
  --vert: #2E7D32;
  --rouge: #c0563f;
  --ambre: #b07615;

  max-width: 1180px; margin: 0 auto; padding: 8px 20px 56px;
}

/* ══════════════ Bandeau d'ouverture ══════════════ */
.hero {
  position: relative; overflow: hidden;
  border-radius: 34px; padding: 52px 32px 44px;
  margin-bottom: 26px; text-align: center;
  background:
    radial-gradient(120% 100% at 50% 0%, #FFFDFA 0%, #F8F1E7 55%, #F3E9DB 100%);
  border: 1px solid var(--bord);
}
.halo { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.halo-a { width: 320px; height: 320px; top: -140px; left: -80px; background: rgba(193, 154, 107, .3); }
.halo-b { width: 280px; height: 280px; bottom: -150px; right: -60px; background: rgba(111, 78, 55, .16); }
.hero-contenu { position: relative; }

.eyebrow {
  display: inline-block; font-size: .68rem; font-weight: 800;
  letter-spacing: .28em; color: var(--sable); margin-bottom: 14px;
}
.hero h1 {
  margin: 0 0 14px; font-size: clamp(2rem, 4.4vw, 3.1rem); font-weight: 800;
  letter-spacing: -.03em; line-height: 1.05; color: var(--brun-fonce);
}
.lead { max-width: 620px; margin: 0 auto; color: var(--doux); line-height: 1.7; font-size: 1rem; }

.stats { display: inline-flex; align-items: center; gap: 14px; margin-top: 22px; flex-wrap: wrap; justify-content: center; }
.stat { font-size: .8rem; color: var(--doux); }
.stat strong { color: var(--brun); font-weight: 800; font-size: 1.02rem; margin-right: 3px; }
.sep { width: 4px; height: 4px; border-radius: 50%; background: var(--sable); opacity: .5; }

.cta {
  margin-top: 26px; display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 15px 13px 13px; border: none; border-radius: 40px; cursor: pointer;
  background: linear-gradient(135deg, #C19A6B, #6F4E37 70%);
  color: #fff; font-weight: 700; font-size: .92rem;
  box-shadow: 0 12px 28px rgba(111, 78, 55, .28);
  transition: transform .25s, box-shadow .25s;
}
.cta:hover { transform: translateY(-2px); box-shadow: 0 18px 34px rgba(111, 78, 55, .36); }
.cta-icone {
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255, 255, 255, .22);
}

/* ══════════════ Barre de filtres ══════════════ */
.barre {
  position: sticky; top: 88px; z-index: 20;
  display: flex; align-items: center; gap: 10px;
  padding: 9px; margin-bottom: 18px;
  background: rgba(255, 255, 255, .86); backdrop-filter: blur(14px);
  border: 1px solid var(--bord); border-radius: 40px;
  box-shadow: 0 8px 24px rgba(62, 44, 31, .07);
}

.champ-recherche {
  display: flex; align-items: center; gap: 9px;
  flex: 1 1 220px; min-width: 0;
  padding: 9px 15px; border-radius: 30px;
  background: var(--creme); color: var(--discret);
  border: 1px solid transparent; transition: border-color .2s, background .2s;
}
.champ-recherche:focus-within { border-color: var(--sable); background: #fff; }
.champ-recherche input {
  flex: 1; min-width: 0; border: none; outline: none; background: transparent;
  font-size: .88rem; color: var(--brun-fonce);
}
.effacer-champ {
  border: none; background: transparent; color: var(--discret);
  cursor: pointer; display: grid; place-items: center; padding: 2px; border-radius: 50%;
}
.effacer-champ:hover { color: var(--brun); }

/* Bande de segments : défile horizontalement au lieu de passer à la ligne */
.segments {
  display: flex; align-items: center; gap: 5px;
  padding: 3px; border-radius: 30px; background: var(--creme);
  overflow-x: auto; scrollbar-width: none; max-width: 100%;
}
.segments::-webkit-scrollbar { display: none; }
.segment {
  display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  border: none; background: transparent; cursor: pointer;
  padding: 8px 15px; border-radius: 26px;
  font-size: .81rem; font-weight: 600; color: var(--doux);
  transition: color .2s, background .2s, box-shadow .2s;
}
.segment-icone { display: inline-flex; opacity: .75; }
.segment:hover { color: var(--brun-fonce); background: rgba(255, 255, 255, .8); }
.segment.actif {
  background: #fff; color: var(--brun); font-weight: 700;
  box-shadow: 0 2px 8px rgba(62, 44, 31, .12);
}
.segment.actif .segment-icone { opacity: 1; }

.bouton-filtres {
  display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
  padding: 10px 16px; border-radius: 30px; cursor: pointer;
  border: 1px solid var(--bord); background: #fff; color: var(--doux);
  font-size: .81rem; font-weight: 600; transition: border-color .2s, color .2s;
}
.bouton-filtres:hover, .bouton-filtres.ouvert { border-color: var(--sable); color: var(--brun); }
.jeton {
  display: grid; place-items: center; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 9px; background: var(--brun); color: #fff; font-size: .66rem; font-weight: 800;
}

/* ══════════════ Filtres avancés ══════════════ */
.avances {
  background: #fff; border: 1px solid var(--bord); border-radius: 24px;
  padding: 22px; margin-bottom: 20px;
}
.grille-avances {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(168px, 1fr)); gap: 14px 16px;
}
.champ { display: flex; flex-direction: column; gap: 6px; }
.champ > span {
  font-size: .68rem; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--discret);
}
.champ input, .champ select {
  height: 42px; box-sizing: border-box;
  border: 1px solid var(--bord); border-radius: 13px; padding: 0 12px;
  background: var(--creme); color: var(--brun-fonce); font-size: .87rem;
  transition: border-color .2s, background .2s;
}
.champ input:focus, .champ select:focus { outline: none; border-color: var(--sable); background: #fff; }

.bascules { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; align-items: center; }
.bascule {
  border: 1px solid var(--bord); background: #fff; color: var(--doux);
  border-radius: 30px; padding: 8px 16px; font-size: .78rem; font-weight: 600; cursor: pointer;
  transition: all .2s;
}
.bascule:hover { border-color: var(--sable); }
.bascule.actif { background: var(--brun); border-color: var(--brun); color: #fff; }
.reinit {
  margin-left: auto; border: none; background: transparent; color: var(--brun);
  font-size: .78rem; font-weight: 700; cursor: pointer; padding: 8px 4px; text-decoration: underline;
  text-underline-offset: 3px;
}

.depli-enter-active, .depli-leave-active { transition: opacity .22s, transform .22s; }
.depli-enter-from, .depli-leave-to { opacity: 0; transform: translateY(-8px); }

.compte { text-align: center; color: var(--discret); font-size: .76rem; margin: 0 0 20px; }

/* ══════════════ États ══════════════ */
.etat {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 64px 20px; text-align: center; color: var(--doux);
}
.etat-rond {
  width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center;
  background: linear-gradient(135deg, #F7EFE4, #EFE2CE); color: var(--sable);
}
.etat.erreur .etat-rond { background: #FBEDE9; color: var(--rouge); }
.etat p { margin: 0; font-size: .95rem; }
.bouton-clair {
  border: 1px solid var(--bord); background: #fff; color: var(--brun);
  padding: 10px 22px; border-radius: 30px; cursor: pointer; font-weight: 700; font-size: .84rem;
}
.bouton-clair:hover { border-color: var(--sable); }

/* ══════════════ Grille & cartes ══════════════ */
.grille {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;
}

.carte {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  background: #fff; border: 1px solid var(--bord); border-radius: 26px;
  padding: 24px 24px 20px;
  box-shadow: 0 2px 6px rgba(62, 44, 31, .04);
  transition: transform .28s cubic-bezier(.2, .8, .3, 1), box-shadow .28s, border-color .28s;
}
.carte:hover {
  transform: translateY(-6px);
  border-color: rgba(193, 154, 107, .55);
  box-shadow: 0 22px 44px rgba(62, 44, 31, .14);
}
.ruban {
  position: absolute; inset: 0 auto auto 0; width: 100%; height: 5px;
  background: linear-gradient(90deg, #C19A6B, #6F4E37);
  opacity: .9;
}
.carte.conference .ruban { background: linear-gradient(90deg, #6F4E37, #3E2C1F); }
.carte.online .ruban { background: linear-gradient(90deg, #4C9A57, #2E7D32); }
.carte.annule .ruban { background: linear-gradient(90deg, #d9836c, #a8482f); }
.carte.annule, .carte.passe { opacity: .72; }
.carte.annule:hover, .carte.passe:hover { opacity: .92; }

.carte-tete { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 16px; }

.date {
  position: relative; flex-shrink: 0;
  width: 62px; padding: 9px 0 11px; border-radius: 18px; text-align: center;
  background: linear-gradient(150deg, #F7EFE4, #E9D9C2);
  border: 1px solid rgba(193, 154, 107, .34);
}
.date .mois {
  display: block; font-size: .58rem; font-weight: 800; letter-spacing: .14em;
  color: var(--sable); margin-bottom: 1px;
}
.date .jour { display: block; font-size: 1.62rem; font-weight: 800; line-height: 1; color: var(--brun-fonce); }

.puces { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
.puce {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 11px; border-radius: 20px;
  font-size: .62rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  background: rgba(193, 154, 107, .15); color: #8a6d4b;
}
.puce.enligne { background: rgba(46, 125, 50, .13); color: var(--vert); }
.puce.alerte { background: rgba(192, 86, 63, .14); color: #a8482f; }
.puce.aujourdhui { background: rgba(176, 118, 21, .15); color: var(--ambre); }
.puce.passee { background: #F2EEE9; color: #8a7c6d; }
.puce.brouillon { background: #EDF1F5; color: #55606e; }
.pulse {
  width: 6px; height: 6px; border-radius: 50%; background: currentColor;
  animation: battement 1.6s ease-in-out infinite;
}
@keyframes battement { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }

.titre {
  margin: 0 0 9px; font-size: 1.2rem; line-height: 1.32; font-weight: 700;
  color: var(--brun-fonce); transition: color .2s;
}
.carte:hover .titre { color: var(--brun); }
.resume {
  margin: 0 0 16px; font-size: .9rem; line-height: 1.65; color: var(--doux); flex-grow: 1;
  display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.motif {
  margin: 0 0 14px; padding: 9px 12px; border-radius: 12px;
  background: #FBEDE9; color: #a8482f; font-size: .78rem;
}

.infos { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.infos li { display: flex; align-items: center; gap: 10px; font-size: .83rem; color: var(--doux); }
.pastille {
  width: 25px; height: 25px; border-radius: 9px; flex-shrink: 0;
  display: grid; place-items: center; background: var(--creme); color: var(--sable);
}
.infos li.gratuit { color: var(--vert); font-weight: 600; }
.infos li.gratuit .pastille { background: rgba(46, 125, 50, .1); color: var(--vert); }

.places { margin-bottom: 16px; }
.jauge { height: 5px; border-radius: 5px; background: #F1EAE0; overflow: hidden; margin-bottom: 7px; }
.remplissage {
  display: block; height: 100%; border-radius: 5px;
  background: linear-gradient(90deg, #C19A6B, #6F4E37); transition: width .5s ease;
}
.remplissage.tendu { background: linear-gradient(90deg, #dd9a6b, #c0563f); }
.places-texte { font-size: .74rem; color: var(--discret); }
.places-texte strong { color: var(--doux); font-weight: 700; }
.places-texte.tendu, .places-texte.tendu strong { color: var(--rouge); }

.actions {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding-top: 16px; border-top: 1px solid #F5F0E9;
}
.actions-secondaires { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rond {
  width: 34px; height: 34px; border-radius: 12px; flex-shrink: 0;
  display: grid; place-items: center; cursor: pointer; text-decoration: none;
  border: 1px solid transparent; background: var(--creme); color: #8a7c6d;
  transition: all .2s;
}
.rond:hover { background: #F3E9DB; color: var(--brun); transform: translateY(-1px); }
.rond.alerte:hover { background: #FDF3E7; color: var(--ambre); }
.rond.verrou { background: rgba(46, 125, 50, .1); color: var(--vert); }
.rond.verrou:hover { background: rgba(46, 125, 50, .18); color: var(--vert); }
.rond.danger:hover { background: #FBEDE9; color: var(--rouge); }

.principal {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
  padding: 11px 22px; border-radius: 30px;
  font-size: .85rem; font-weight: 700; color: #fff;
  background: linear-gradient(135deg, #C19A6B, #6F4E37 75%);
  box-shadow: 0 6px 16px rgba(111, 78, 55, .22);
  transition: transform .22s, box-shadow .22s, filter .22s;
}
.principal:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(111, 78, 55, .3); }
.principal.inscrit { background: linear-gradient(135deg, #5c9b56, #3d7a3a); box-shadow: 0 6px 16px rgba(61, 122, 58, .24); }
.principal.visio { background: linear-gradient(135deg, #4C9A57, #2E7D32); box-shadow: 0 6px 16px rgba(46, 125, 50, .24); }
.principal.indisponible, .principal:disabled {
  background: #EDE7DF; color: #a99e90; cursor: not-allowed; box-shadow: none;
}
.mini-spin {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .45); border-top-color: #fff;
  animation: tourne .7s linear infinite;
}
@keyframes tourne { to { transform: rotate(360deg); } }

/* ══════════════ Silhouettes de chargement ══════════════ */
.silhouette { pointer-events: none; }
.silhouette .s-tete { display: flex; justify-content: space-between; margin-bottom: 18px; }
.s-date, .s-puce, .s-ligne, .s-barre, .s-bouton {
  display: block; border-radius: 10px;
  background: linear-gradient(90deg, #F4EEE6 25%, #EDE4D8 50%, #F4EEE6 75%);
  background-size: 200% 100%; animation: scintille 1.4s ease-in-out infinite;
}
.s-date { width: 62px; height: 62px; border-radius: 18px; }
.s-puce { width: 88px; height: 22px; border-radius: 20px; }
.s-ligne { height: 13px; margin-bottom: 10px; }
.s-ligne.large { height: 20px; width: 72%; }
.s-ligne.courte { width: 48%; }
.silhouette .s-pied { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 20px; }
.s-barre { height: 6px; flex: 1; }
.s-bouton { width: 108px; height: 40px; border-radius: 30px; }
@keyframes scintille { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ══════════════ Modales ══════════════ */
.voile {
  position: fixed; inset: 0; z-index: 1000; padding: 18px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(62, 44, 31, .48); backdrop-filter: blur(5px);
}
.modale {
  width: 100%; max-width: 640px; max-height: 88vh; overflow-y: auto;
  background: #fff; border-radius: 30px; padding: 28px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, .26);
}
.modale.etroite { max-width: 440px; text-align: center; }
.modale-tete { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.modale-tete h2 { margin: 0; font-size: 1.25rem; color: var(--brun-fonce); }
.fermer {
  width: 34px; height: 34px; border-radius: 50%; border: none; cursor: pointer;
  display: grid; place-items: center; background: var(--creme); color: var(--doux);
}
.fermer:hover { background: #F1E7DA; color: var(--brun-fonce); }
.modale h3 { margin: 0 0 10px; font-size: 1.1rem; color: var(--brun-fonce); }
.modale.etroite p { margin: 0 0 20px; color: var(--doux); font-size: .9rem; }
.modale-rond {
  width: 62px; height: 62px; margin: 0 auto 16px; border-radius: 50%;
  display: grid; place-items: center; background: #FBEDE9; color: var(--rouge);
}
.sous-titre-modale { color: var(--discret); font-size: .86rem; margin: 0 0 18px; }

.formulaire { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.formulaire .pleine { grid-column: 1 / -1; }
.formulaire label {
  display: flex; flex-direction: column; gap: 6px;
  font-size: .68rem; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; color: var(--discret);
}
.formulaire input, .formulaire select, .formulaire textarea {
  border: 1px solid var(--bord); border-radius: 13px; padding: 11px 13px;
  font-size: .9rem; font-family: inherit; color: var(--brun-fonce);
  background: var(--creme); text-transform: none; letter-spacing: normal; font-weight: 400;
}
.formulaire input:focus, .formulaire select:focus, .formulaire textarea:focus {
  outline: none; border-color: var(--sable); background: #fff;
}
.option-case {
  flex-direction: row !important; align-items: flex-start; gap: 11px !important;
  background: var(--creme); padding: 13px 15px; border-radius: 15px;
  text-transform: none !important; letter-spacing: normal !important;
  font-size: .82rem !important; font-weight: 500 !important; color: var(--doux) !important;
}
.option-case input { width: auto; margin-top: 2px; }

.champ-modale {
  display: flex; flex-direction: column; gap: 7px; text-align: left; margin-bottom: 20px;
  font-size: .68rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--discret);
}
.champ-modale textarea, .champ-modale input {
  border: 1px solid var(--bord); border-radius: 13px; padding: 11px 13px;
  font-family: inherit; font-size: .9rem; color: var(--brun-fonce); background: var(--creme);
  text-transform: none; letter-spacing: normal; font-weight: 400;
}
.champ-modale textarea:focus, .champ-modale input:focus { outline: none; border-color: var(--sable); background: #fff; }

.erreur-form { margin: 0; color: var(--rouge); font-size: .82rem; }
.modale-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.modale-actions button {
  padding: 11px 24px; border-radius: 30px; border: none; cursor: pointer;
  font-weight: 700; font-size: .86rem;
}
.clair { background: #F1EDE8; color: var(--doux); }
.clair:hover { background: #E9E3DA; }
.plein { background: linear-gradient(135deg, #C19A6B, #6F4E37 75%); color: #fff; }
.plein:disabled { opacity: .6; cursor: not-allowed; }
.danger { background: var(--rouge); color: #fff; }

.liste-participants { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; max-height: 46vh; overflow-y: auto; }
.liste-participants li { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 15px; background: var(--creme); }
.jeton-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  display: grid; place-items: center; font-weight: 700; font-size: .84rem; color: #fff;
  background: linear-gradient(135deg, #C19A6B, #6F4E37);
}
.liste-participants .nom { flex: 1; font-size: .88rem; color: var(--brun-fonce); }
.liste-participants time { font-size: .72rem; color: var(--discret); }

/* ══════════════ Adaptation ══════════════ */
@media (max-width: 900px) {
  .barre { flex-wrap: wrap; border-radius: 26px; }
  .champ-recherche { flex: 1 1 100%; }
  .segments { flex: 1 1 auto; }
  .etiquette-filtres { display: none; }
}
@media (max-width: 640px) {
  .agenda { padding: 4px 14px 40px; }
  .hero { padding: 38px 20px 34px; border-radius: 28px; }
  .grille { grid-template-columns: 1fr; }
  .formulaire { grid-template-columns: 1fr; }
  .actions { flex-direction: column; align-items: stretch; }
  .principal { width: 100%; }
  .actions-secondaires { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .carte, .cta, .principal, .segment, .rond, .remplissage, .titre { transition: none; }
  .pulse, .mini-spin, .s-ligne, .s-date, .s-puce, .s-barre, .s-bouton { animation: none; }
}
</style>
