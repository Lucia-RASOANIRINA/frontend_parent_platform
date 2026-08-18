import HomeTeacher from '../../pages/HomeTeacher.vue'
import DiscussionsTeacher from '../../pages/DiscussionsTeacher.vue'
import RessourcesTeacher from '../../pages/RessourcesTeacher.vue'
import TeacherPub from '../../pages/TeacherPub.vue'
import ProfilTeacher from '../../pages/ProfilTeacher.vue'
import EvenementsTeacher from '../../pages/EvenementsTeacher.vue'
import ConferencesTeacher from '../../pages/ConferencesTeacher.vue'

/** Espace des éducatrices. */
const meta = { layout: 'educatrice', role: 'EDUCATEUR', showFooter: true }

export default [
  { path: '/hometeacher', name: 'HomeTeacher', component: HomeTeacher, meta },
  { path: '/discussionsteacher', name: 'DiscussionsTeacher', component: DiscussionsTeacher, meta: { ...meta, showFooter: false } },
  { path: '/teacherpub', name: 'TeacherPub', component: TeacherPub, meta },
  { path: '/ressourcesteacher', name: 'RessourcesTeacher', component: RessourcesTeacher, meta },
  { path: '/profilteacher', name: 'ProfilTeacher', component: ProfilTeacher, meta },
  { path: '/teacher/evenements', name: 'EvenementsTeacher', component: EvenementsTeacher, meta },
  { path: '/teacher/conferences', name: 'ConferencesTeacher', component: ConferencesTeacher, meta },
]
