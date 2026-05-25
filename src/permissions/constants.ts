export const Event_Permissions = {
  CREATE_EVENT: "event:create",
  UPDATE_EVENT: "event:update",
  DELETE_EVENT: "event:delete",
  VIEW_EVENT: "event:view",
  PUBLISH_EVENT: "event:publish",
  JOIN_EVENT: "event:join",
  LEAVE_EVENT: "event:leave",
} as const;

export const Member_Permissions = {
  CREATE_MEMBER: "member:create",
  UPDATE_MEMBER: "member:update",
  DELETE_MEMBER: "member:delete",
  VIEW_MEMBER: "member:view",
} as const;

export const Contact_Permissions = {
  VIEW_CONTACT_DIRECTORY: "contact:view",
  EMAIL_CONTACT: "contact:email",
  SUBMIT_SUPPORT_TICKET: "contact:support",
} as const;

export const Project_Permissions = {
  VIEW_PROJECT: "project:view",
  CREATE_PROJECT: "project:create",
  UPDATE_PROJECT: "project:update",
  DELETE_PROJECT: "project:delete",
} as const;

export const App_Permissions = {
  ...Event_Permissions,
  ...Member_Permissions,
  ...Contact_Permissions,
  ...Project_Permissions,
} as const;

export type Permission = (typeof App_Permissions)[keyof typeof App_Permissions];
