/**
 * Interactive Simulations for NeuroQuest
 *
 * This module provides Three.js powered 3D simulations for science and math concepts.
 * Each simulation is dynamically imported to reduce bundle size.
 *
 * Simulations available:
 * - WaterCycle3D: Interactive water cycle visualization
 * - CircuitBuilder: Interactive circuit simulation
 * - FractionVisualizer: 3D fraction blocks
 * - PhysicsLab: Force and motion simulations
 * - SimulationScene: Wrapper component for any simulation type
 *
 * Usage:
 * ```typescript
 * import { SimulationScene, SimulationType } from '@/components/simulations';
 *
 * <SimulationScene
 *   type="water-cycle"
 *   params={{ activeStage: 'evaporation' }}
 *   onStageClick={(stage) => console.log(stage)}
 * />
 * ```
 */

export { default as WaterCycle3D } from './WaterCycle3D';
export { default as CircuitBuilder } from './CircuitBuilder';
export { default as FractionVisualizer } from './FractionVisualizer';
export { default as PhysicsLab } from './PhysicsLab';
export { default as SimulationScene } from './SimulationScene';

export type { SimulationType } from './SimulationScene';