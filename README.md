# typescript-ink7-clear-terminal-a2-enter-overflow-demo

## 简介

精准触发 Ink 7 **路径 A2**：`isOverflowing && hadPreviousFrame` — dynamic 从「未超屏」**第一次**长到 `> stdout.rows` 时 `clearTerminal`。

## 快速开始

```bash
pnpm install
pnpm start
```

初始 8 行动态区（稳定、不闪）。**按 `o` 一次**跳到 `rows + 3` 行，观察绿色 STATIC 行是否在按键瞬间闪一下。stderr 打印 `[A2] overflow enter`。

按 `q` 退出。

## 如何判断 Static 是否被刷新

1. **Command A 全选**或鼠标拖选绿色 STATIC 行，保持选区
2. 按 `o` 进入超屏
3. **选区消失** → Static 被重写（本 demo：按 `o` 瞬间 `clearTerminal`）
4. **选区保留** → Static 未重写

**本 demo 预期**：按 `o` 前选区应保留；按 `o` 瞬间选区应消失。

## 教程

与 A1 区别：A1 是「已经超屏后每帧继续 clear」；A2 是「进入超屏的那一帧」。按 `o` 前 `lastOutputHeight > 0` 且本帧 `outputHeight > rows`，满足 A2。

## 注意事项

- 必须在 TTY 跑
- 若按 o 后继续 tick，后续帧会落入 A1（wasOverflowing）
