#!/usr/bin/env node
import { Box, Static, Text, render, useApp, useInput, useStdout } from "ink";
import { type FC, useMemo, useState } from "react";

// Ink 路径 A2：isOverflowing && hadPreviousFrame — 首次从非超屏进入超屏
const STATIC_MARKER = "▓▓▓ STATIC ▓▓▓ 按 o 瞬间若闪 = clearTerminal(A2 enter overflow)";

const App: FC = () => {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const rows = stdout?.rows ?? 24;

  // 初始 8 行，远小于 rows；按 o 后跳到 rows + 3
  const [lineCount, setLineCount] = useState(8);
  const [tick, setTick] = useState(0);

  const dynamicLines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, index) => {
      return `dynamic ${String(index + 1).padStart(3, "0")} / ${lineCount} | rows=${rows} | tick=${tick}`;
    });
  }, [lineCount, rows, tick]);

  useInput((input) => {
    if (input === "q") {
      exit();
      return;
    }

    if (input === "o") {
      const next = rows + 3;
      process.stderr.write(`[A2] overflow enter: ${lineCount} → ${next} (>${rows})\n`);
      setLineCount(next);
      setTick((value) => value + 1);
    }
  });

  return (
    <Box flexDirection="column">
      <Static items={[STATIC_MARKER]}>
        {(item) => (
          <Text bold color="green">
            {item}
          </Text>
        )}
      </Static>

      <Box flexDirection="column" marginTop={1}>
        <Text bold>Ink A2 · isOverflowing && hadPreviousFrame</Text>
        <Text dimColor>当前 {lineCount} 行（未超屏）| 按 o 一次进入超屏 | q 退出</Text>
        {dynamicLines.map((line) => (
          <Text key={line}>{line}</Text>
        ))}
      </Box>
    </Box>
  );
};

render(<App />);
