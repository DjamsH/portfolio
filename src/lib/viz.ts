/**
 * Les schémas des études de cas sont décrits en SVG statique (état final).
 * Chaque élément animé porte :
 *   data-a : draw | pop | rise | fade | wipe | flash | move | travel
 *   data-t : instant de départ dans la timeline (secondes abstraites, pilotées par le scroll)
 *   data-d : durée (0.5 par défaut)
 *   data-v : paramètres (« dx,dy,rotation » pour move, étapes « dx,dy,dx,dy… » pour travel)
 * Voir src/scripts/motion.ts (caseVisuals).
 */

export type Edge = { x: number; y: number; length: number; angle: number };

/** Segment exprimé comme une ligne horizontale à tracer (scaleX) dans un repère tourné. */
export function edge(x1: number, y1: number, x2: number, y2: number): Edge {
  return {
    x: x1,
    y: y1,
    length: Math.round(Math.hypot(x2 - x1, y2 - y1) * 100) / 100,
    angle: Math.round(((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI) * 100) / 100,
  };
}

export const round = (value: number) => Math.round(value * 100) / 100;
