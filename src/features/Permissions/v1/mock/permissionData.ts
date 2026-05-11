export type Permission = {
  label: string;
  granted: boolean;
};

export type PermissionMember = {
  id: number;
  name: string;
  image: string;
  role: string;
  email: string;
  status: string;
  permissions: Permission[];
};

export const permissionData: PermissionMember[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Admin",
    email: "arjun@commdesk.io",
    status: "Active",
    permissions: [
      { label: "can-create", granted: true },
      { label: "can-edit", granted: true },
      { label: "can-delete", granted: true },
      { label: "can-view", granted: true },
      { label: "can-publish", granted: true },
    ],
  },
  {
    id: 2,
    name: "Priya Sharma",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "Organizer",
    email: "priya@commdesk.io",
    status: "Active",
    permissions: [
      { label: "can-create", granted: true },
      { label: "can-edit", granted: true },
      { label: "can-delete", granted: false },
      { label: "can-view", granted: true },
      { label: "can-publish", granted: false },
    ],
  },
  {
    id: 3,
    name: "Rahul Verma",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "Volunteer",
    email: "rahul@commdesk.io",
    status: "Active",
    permissions: [
      { label: "can-create", granted: false },
      { label: "can-edit", granted: true },
      { label: "can-delete", granted: false },
      { label: "can-view", granted: true },
      { label: "can-publish", granted: false },
    ],
  },
  {
    id: 4,
    name: "Sneha Iyer",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "Member",
    email: "sneha@commdesk.io",
    status: "Inactive",
    permissions: [
      { label: "can-create", granted: false },
      { label: "can-edit", granted: false },
      { label: "can-delete", granted: false },
      { label: "can-view", granted: true },
      { label: "can-publish", granted: false },
    ],
  },
  {
    id: 5,
    name: "Dev Patel",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "Organizer",
    email: "dev@commdesk.io",
    status: "Active",
    permissions: [
      { label: "can-create", granted: true },
      { label: "can-edit", granted: true },
      { label: "can-delete", granted: false },
      { label: "can-view", granted: true },
      { label: "can-publish", granted: true },
    ],
  },
  {
    id: 6,
    name: "Anaya Singh",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    role: "Visitor",
    email: "anaya@commdesk.io",
    status: "Active",
    permissions: [
      { label: "can-create", granted: false },
      { label: "can-edit", granted: false },
      { label: "can-delete", granted: false },
      { label: "can-view", granted: true },
      { label: "can-publish", granted: false },
    ],
  },
];