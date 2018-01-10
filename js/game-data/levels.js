var levels = {
  1: {
    isCurrent: true,      // ТЕКУЩИЙ УРОВЕНЬ (ДА/ НЕТ)
    stepsAvailable: 3,
    operationsAvailable: [mathOperations['+'](2)],
    initValue: 0,
    goal: 6,
    operValIsArray: false,
    operVal: 0            // ЗНАЧЕНИЕ, С КОТОРЫМ БУДЕМ РАБОТАТЬ
  },
  2: {
    isCurrent: false,
    stepsAvailable: 2,
    operationsAvailable: [mathOperations['+'](2), mathOperations['-'](3)],
    initValue: 0,
    goal: 4,
    operValIsArray: false,
    operVal: 0
  },
  3: {
    isCurrent: false,
    stepsAvailable: 3,
    operationsAvailable:  [mathOperations['+'](2), mathOperations['-'](3), mathOperations['/'](2), otherOperations['reverse']],
    initValue: 0,
    goal: 6,
    operValIsArray: false,
    operVal: 0
  }
};
