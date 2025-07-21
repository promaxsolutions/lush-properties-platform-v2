import { 
  users, 
  projects, 
  teamInvitations,
  teamMembers,
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type TeamInvitation,
  type InsertTeamInvitation,
  type TeamMember,
  type InsertTeamMember
} from "@shared/schema";
import { db } from "./db";
import { eq, and, lt } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Team invitation methods
  createTeamInvitation(invitation: Omit<InsertTeamInvitation, 'magicToken' | 'tokenExpiry'>): Promise<TeamInvitation>;
  getInvitationByToken(token: string): Promise<TeamInvitation | undefined>;
  updateInvitationStatus(token: string, status: string): Promise<boolean>;
  updateLastLogin(token: string): Promise<boolean>;
  cleanupExpiredInvitations(): Promise<number>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
}

export class DatabaseStorage implements IStorage {
  private generateSecureToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  // Team invitation methods
  async createTeamInvitation(invitationData: Omit<InsertTeamInvitation, 'magicToken' | 'tokenExpiry'>): Promise<TeamInvitation> {
    const magicToken = this.generateSecureToken();
    const tokenExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours from now
    
    const [invitation] = await db
      .insert(teamInvitations)
      .values({
        ...invitationData,
        magicToken,
        tokenExpiry,
      })
      .returning();
    return invitation;
  }

  async getInvitationByToken(token: string): Promise<TeamInvitation | undefined> {
    const [invitation] = await db
      .select()
      .from(teamInvitations)
      .where(eq(teamInvitations.magicToken, token));
    return invitation || undefined;
  }

  async updateInvitationStatus(token: string, status: string): Promise<boolean> {
    const result = await db
      .update(teamInvitations)
      .set({ status })
      .where(eq(teamInvitations.magicToken, token));
    return result.rowCount > 0;
  }

  async updateLastLogin(token: string): Promise<boolean> {
    const result = await db
      .update(teamInvitations)
      .set({ 
        lastLogin: new Date(),
        status: 'active'
      })
      .where(eq(teamInvitations.magicToken, token));
    return result.rowCount > 0;
  }

  async cleanupExpiredInvitations(): Promise<number> {
    const result = await db
      .update(teamInvitations)
      .set({ status: 'expired' })
      .where(and(
        lt(teamInvitations.tokenExpiry, new Date()),
        eq(teamInvitations.status, 'pending')
      ));
    return result.rowCount;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return teamMember;
  }
}

export const storage = new DatabaseStorage();
