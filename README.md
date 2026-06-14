# typescript-ink7-clear-terminal-a2-enter-overflow-demo

## 简介

精准触发 Ink 7 **路径 A2**：`isOverflowing && hadPreviousFrame` — dynamic 从「未超屏」**第一次**长到 `> stdout.rows` 时 `clearTerminal`。

## 快速开始

```bash
pnpm install
pnpm start
```

## 复现步骤

1. 启动后**只有绿色 STATIC 一行**，stderr 提示开始计时
2. 立刻 **Command+A 全选**（或拖选）绿色 STATIC 行，保持选区
3. **5 秒后**自动插入 `rows + 3` 行动态区 → 观察选区是否消失
4. **8 秒后**（+3s）动态区再 +1 行 → 再次观察选区
5. 之后**每 3 秒**继续 +1 行 → 观察 Static 是否持续闪

按 `q` 退出。

## 如何判断 Static 是否被刷新

| 时机 | 选区消失 | 含义 |
|---|---|---|
| 5s 等待期间 | 否 | 仅 Static，未超屏 |
| 5s **第一次进入超屏** | **否** | `isOverflowing && hadPreviousFrame` 成立，但选区仍保留（实测） |
| 8s **第二次**（已超屏后再 +1 行） | **是** | `wasOverflowing`（A1）→ `clearTerminal`，Static 被重写 |
| 之后每 3s +1 行 | 是 | A1 持续 `clearTerminal` |

**本 demo 实测结论**：第一次超屏选区不消失，第二次才消失 — 与 Ink 7 条件分支一致：

- **A2**（`isOverflowing && hadPreviousFrame`）：进入超屏那一帧；选区检测上**不一定**立刻消失
- **A1**（`wasOverflowing`）：已超屏后每帧继续 clear；**选区会消失**

若首帧就直接超屏（`hadPreviousFrame === false`），A2 也不触发 clear — 不会闪。

## 教程

与 A1 区别：A1 是「已经超屏后每帧继续 clear」；A2 是「进入超屏的那一帧」。5s 时 `previousOutputHeight > 0` 且本帧 `outputHeight > rows`，满足 A2；8s 起上一帧已超屏，落入 A1。

## 注意事项

- 必须在 TTY 跑
- stderr 会打印 `[A2]` / `[A1]` 阶段日志
