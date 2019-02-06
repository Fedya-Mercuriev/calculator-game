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
    stepsAvailable: 3,
    operationsAvailable: [mathOperations['+'](1), mathOperations['+'](2), mathOperations['*'](4)],
    initValue: 0,
    goal: 12,
    operValIsArray: false,
    operVal: 0
  },
  3: {
    isCurrent: false,
    stepsAvailable: 3,
    operationsAvailable:  [mathOperations['-'](2), mathOperations['+'](4)],
    initValue: 1,
    goal: 7,
    operValIsArray: false,
    operVal: 1
  },
  4: {
    isCurrent: false,
    stepsAvailable: 4,
    operationsAvailable:  [mathOperations['+'](2), mathOperations['*'](4)],
    initValue: 1,
    goal: 64,
    operValIsArray: false,
    operVal: 1
  },
};
