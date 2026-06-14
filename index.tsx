#!/usr/bin/env node
import { Box, Static, Text, render, useApp, useInput, useStdout } from "ink";
import { type FC, useEffect, useMemo, useState } from "react";

// Ink 路径 A2：isOverflowing && hadPreviousFrame — 首次从非超屏进入超屏
const STATIC_MARKER =
  "▓▓▓ STATIC ▓▓▓ 请 Command+A 全选本行 | 5s 后自动超屏 | 选区消失 = clearTerminal";

const SELECT_WINDOW_MS = 5_000;
const GROW_INTERVAL_MS = 3_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const App: FC = () => {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const rows = stdout?.rows ?? 24;

  const [lineCount, setLineCount] = useState(0);
  const [phase, setPhase] = useState<"select" | "overflow" | "growing">("select");
  const [growStep, setGrowStep] = useState(0);

  const dynamicLines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, index) => {
      return `dynamic ${String(index + 1).padStart(3, "0")} / ${lineCount} | rows=${rows} | grow=${growStep}`;
    });
  }, [growStep, lineCount, rows]);

  useEffect(() => {
    let cancelled = false;

    process.stderr.write(
      "[demo] 启动：仅 Static 一行。请 Command+A 全选绿色 STATIC，5s 后自动进入超屏\n",
    );

    void (async () => {
      await sleep(SELECT_WINDOW_MS);
      if (cancelled) {
        return;
      }

      const initial = rows + 3;
      process.stderr.write(`[A2] overflow enter: 0 → ${initial} (>${rows})\n`);
      setLineCount(initial);
      setPhase("overflow");

      while (!cancelled) {
        await sleep(GROW_INTERVAL_MS);
        if (cancelled) {
          return;
        }

        setLineCount((value) => {
          const next = value + 1;
          process.stderr.write(`[A1] wasOverflowing grow: ${value} → ${next}\n`);
          return next;
        });
        setGrowStep((value) => value + 1);
        setPhase("growing");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rows]);

  useInput((input) => {
    if (input === "q") {
      exit();
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

      {lineCount > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>Ink A2 → A1 · {phase}</Text>
          <Text dimColor>
            已 {lineCount} 行（{lineCount > rows ? "超屏" : "未超屏"}）| 每 3s +1 行 | q 退出
          </Text>
          {dynamicLines.map((line) => (
            <Text key={line}>{line}</Text>
          ))}
        </Box>
      )}
    </Box>
  );
};

render(<App />);
