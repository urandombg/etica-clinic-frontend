import Patients from "@/views/Patients/Patients";
import PatientCreate from "@/views/Patients/PatientCreate";
import PatientView from "@/views/Patients/PatientView";
// import ReminderList from "@/views/Reminders/RemindersList";
// import MkbComponent from "@/views/Mkb/MkbMain";
// import ToothChart from "@/views/Dental/ToothChart";
// import InvoiceItems from "@/views/Invoices/InvoiceTableItems";
import LoginComponent from "@/components/Login/LoginComponent";
import Users from '@/views/Users/Users'
import ViewUser from '@/views/Users/ViewUser'
import Dashboard from '@/views/Dashboard/Dashboard'

import SingleAppointmentSchedule from '@/views/Schedules/Partials/SingleAppointmentSchedule'
import SpecialistSchedule2 from '@/views/Schedules/Partials/SpecialistSchedulev2';
import OrthoAppointmentSchedule from '@/views/Schedules/Partials/OrthoAppointmentSchedule';
import NeuroSchedule from '@/views/Schedules/Partials/NeuroSchedule';
import CardioSchedule from '@/views/Schedules/Partials/CardioSchedule';
import PediatricSchedule from '@/views/Schedules/Partials/PediatricSchedule';
import SingleAppointmentSchedulev2 from '@/views/Schedules/Partials/SingleAppointmentSchedulev2';
import EndocrinologySchedule from '@/views/Schedules/Partials/EndocrinologySchedule';
import RheumatologySchedule from '@/views/Schedules/Partials/RheumatologySchedule';
import NeuroSurgerySchedule from '@/views/Schedules/Partials/NeuroSurgerySchedule';

import ProcedureList from '@/views/Procedures/ProcedureList';
import CreateNewProcedure from '@/views/Procedures/CreateNewProcedure';
import EditProcedure from '@/views/Procedures/EditProcedure';

export const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/procedures',
    component: ProcedureList,
  },
  {
    path: '/procedures/create',
    component: CreateNewProcedure
  },
  {
    path: '/procedures/edit/:id',
    component: EditProcedure
  },
  {
    path: '/schedules',
    name: 'Графици',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path:'dental',
        name: 'Дентални лекари',
        component: SingleAppointmentSchedule,
        meta: {
          breadCrumb: 'Дентална медицина'
        }
      },
      {
        path:'dental2',
        name: 'Дентални лекари2',
        component: SingleAppointmentSchedulev2
      },
      {
        path:'physiotherapists',
        name: 'Физиотерапевти',
        component: SpecialistSchedule2
      },
      {
        path:'ortho',
        name: 'Ортопедия',
        component: OrthoAppointmentSchedule
      },
      {
        path:'neuro',
        name: 'График неврология',
        component: NeuroSchedule
      },
      {
        path:'pediatrics',
        name: 'График "Детска неонатология"',
        component: PediatricSchedule
      },
      {
        path:'cardio',
        name: 'График "Кардиология"',
        component: CardioSchedule
      },
      {
        path:'endocrinology',
        name: 'График "Ендокринология"',
        component: EndocrinologySchedule
      },
      {
        path:'rheumatology',
        name: 'График "Ревматология"',
        component: RheumatologySchedule
      },
      {
        path:'neurosurgery',
        name: 'График "Неврохирургия"',
        component: NeuroSurgerySchedule
      },
      {
        path:'test',
        name: 'test',
        component: SingleAppointmentSchedulev2
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Табло',
    component: Dashboard,
    meta: {
      breadCrumb: 'Табло',
      requiresAuth: true
    },
  },
  {
    path: '/users',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: '',
        name: 'Списък с потребители',
        component: Users
      },
      {
        path: ':id',
        component: ViewUser
      }
    ],
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/patients',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    meta: {
      breadCrumb: 'Пациенти',
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Списък с пациенти',
        component: Patients
      },
      {
        path: '/patients/create',
        component: {
          render(c) {
            return c('router-view')
          },
          meta: {
            breadCrumb: 'Създаване на нов пациент',
            name: 'mami'
          }
        },
        children: [
          {
            path: '',
            component: PatientCreate
          }
        ]
      },
      {
        path: ':id',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        meta: {
          breadCrumb: 'Преглед ',
          name: ''
        },
        children: [
          {
            path: '',
            component: PatientView
          }
        ]
      }
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent
  },
];
export default routes;