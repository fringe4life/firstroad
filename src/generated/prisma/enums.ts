
/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// @ts-nocheck 
/**
* This file exports all enum related types from the schema.
*
* 🟢 You can import this file directly.
*/
export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]
