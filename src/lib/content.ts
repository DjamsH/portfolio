import * as simpleIcons from 'simple-icons';
import { clients, tools, type Client, type Figure, type Tool } from '../content/site';

type SimpleIcon = { title: string; slug: string; hex: string; path: string };

const iconsBySlug = new Map<string, SimpleIcon>();
for (const value of Object.values(simpleIcons) as unknown[]) {
  const icon = value as Partial<SimpleIcon> | null;
  if (icon && typeof icon === 'object' && icon.slug && icon.path && icon.hex) {
    iconsBySlug.set(icon.slug, icon as SimpleIcon);
  }
}

export type ResolvedTool = Tool & { path?: string; hex?: string };

/** Outil activé, avec son tracé simple-icons s'il existe. `undefined` si désactivé ou inconnu. */
export function getTool(id: string): ResolvedTool | undefined {
  const tool = tools.find((t) => t.id === id);
  if (!tool || !tool.enabled) return undefined;
  const icon = tool.icon ? iconsBySlug.get(tool.icon) : undefined;
  return { ...tool, path: icon?.path, hex: icon?.hex };
}

export function getTools(ids: string[]): ResolvedTool[] {
  return ids.map(getTool).filter((t): t is ResolvedTool => Boolean(t));
}

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export const enabledClients = clients.filter((c) => c.enabled);

const numberFormat = new Intl.NumberFormat('fr-FR');

/** Nombre au format français. L'espace fine insécable est remplacée par une insécable simple,
 *  présente dans toutes les polices du site. */
export function formatNumber(value: number): string {
  return numberFormat.format(value).replace(/\u202f/g, '\u00a0');
}

export function formatFigure(figure: Figure): string {
  return `${figure.prefix ?? ''}${formatNumber(figure.value)}${figure.suffix ?? ''}`;
}

/** Découpe « un texte *accentué* ici » en fragments, les impairs étant en italique. */
export function richParts(text: string): { text: string; em: boolean }[] {
  return text
    .split('*')
    .map((part, index) => ({ text: part, em: index % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}

export function plain(text: string): string {
  return text.replaceAll('*', '');
}
