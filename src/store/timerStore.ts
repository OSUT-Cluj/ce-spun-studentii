import create from 'zustand';
import { TIMER_BONUS, TIMER_LENGTH } from '../utils/contants';

type TimerStore = {
  currentTime: number;
  isRunning: boolean;
  isFirstRound: boolean;
  timerLength: number;
  startTimer: () => void;
  stopTimer: () => void;
  setFirstRoundTimer: () => void;
  setSecondRoundTimer: () => void;
  tick: () => void;
};

type Animate = {
  started: boolean;
  setStarted: (value: boolean) => void;
};

const useTimerStore = create<TimerStore>((set) => ({
  currentTime: TIMER_LENGTH,
  isRunning: false,
  isFirstRound: true,
  timerLength: TIMER_LENGTH,
  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
  setFirstRoundTimer: () =>
    set({ currentTime: TIMER_LENGTH, isRunning: false, isFirstRound: true }),
  setSecondRoundTimer: () =>
    set({ currentTime: TIMER_LENGTH + TIMER_BONUS, isRunning: false, isFirstRound: false }),
  tick: () =>
    set((state) => {
      if (state.currentTime > 0) {
        return { currentTime: state.currentTime - 1 };
      }
      return { isRunning: false };
    })
}));

const useAnimationStore = create<Animate>((set) => ({
  started: false,
  setStarted: (value) => set({ started: value })
}));

export default useTimerStore;
export { useAnimationStore };
