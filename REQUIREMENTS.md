## 使用规则

- [x] [RULE-001] 所有可执行需求都必须有稳定 ID
  - [ ] ID 不随排序变化而变化
  - [ ] 拆分任务时保留原 ID，并新增子 ID
  - [ ] 删除任务时不要直接移除，改为标记为取消
- [x] [RULE-002] 任务状态使用 Obsidian 原生 checkbox
  - [ ] `- [ ]` 表示未完成
  - `- [x]` 表示已完成
  - [ ] 阻塞、延后、取消用文字标注在任务后方，例如 `#blocked`、`#deferred`、`#cut`
  - [ ] 针对不适用是否完成的任务，`- [ ]` 表示未读，`- [x]` 表示已读
- [x] [RULE-003] 任务关系通过缩进表达
  - 父任务代表 Epic / Feature
  - 子任务代表 Task / Acceptance Criteria
  - AI 更新时不得破坏缩进层级
- [x] [RULE-004] 标签只用于快速筛选
  - 阶段标签：`#phase-0`、`#phase-1`
  - 类型标签：`#epic`、`#feature`、`#dsl`、`#export`、`#qa`
  - 优先级标签：`#P0`、`#P1`、`#P2`

***

# Phase 0：基础架构与语法框架

## P0-A：项目与资产基础

- [x] [P0-A-000] 建立项目基础架构 #epic #phase-0 #P0
  - [x] [P0-A-001] 定义项目文件格式
    - 支持创建新项目
    - 支持保存项目
    - 支持加载项目
    - 项目文件记录版本号
    - 项目文件记录资产列表
    - 项目文件记录命令历史
    - 项目文件记录导出预设
  - [x] [P0-A-002] 定义资产类型
    - PixelAsset
    - VoxelAsset
    - SceneAsset
    - Animation2D
    - Animation3D
    - RenderScene
    - MaterialAsset
    - ExportPreset
  - [x] [P0-A-003] 定义资产注册表
    - 每个资产有稳定 ID
    - 每个资产有名称
    - 每个资产有类型
    - 可以通过 ID 查找资产
    - 可以检测资产引用关系
  - [x] [P0-A-004] 定义项目资源路径规则
    - 内部资源使用相对路径
    - 导入资源保留来源记录
    - 缺失资源时给出 warning

## P0-B：坐标系与基础数据规则

- [ ] [P0-B-000] 定义 2D / 3D 坐标与视图映射 #epic #phase-0 #P0
  - [x] [P0-B-001] 定义 3D 体素坐标
    - x 表示左右
    - y 表示前后 / 深度
    - z 表示上下 / 高度
  - [x] [P0-B-002] 定义 2D 像素坐标
    - 明确画布原点
    - 明确 x / y 方向
    - 明确透明像素的含义
  - [x] [P0-B-003] 定义三视图映射
    - Front View 对应 x / z
    - Side View 对应 y / z
    - Top View 对应 x / y
  - [ ] [P0-B-004] 定义 MagicaVoxel 坐标转换
    - 导入 `.vox` 时转换坐标
    - 导出 `.vox` 时转换坐标
    - 转换规则写入文档

## P0-C：Palette 与材质预留

- [ ] [P0-C-000] 建立统一 Palette 系统 #epic #phase-0 #P0
  - [x] [P0-C-001] 创建 Palette
  - [ ] [P0-C-002] 添加颜色
  - [ ] [P0-C-003] 删除颜色
  - [ ] [P0-C-004] 替换颜色
  - [x] [P0-C-005] PixelAsset 引用 Palette
  - [x] [P0-C-006] VoxelAsset 引用 Palette
  - [x] [P0-C-007] Palette 颜色预留 Material 绑定能力

## P0-D：Command / DSL 基础

- [ ] [P0-D-000] 建立 Command 系统 #epic #dsl #phase-0 #P0
  - [x] [P0-D-001] 定义 Command 基础结构
    - 每个 command 有 ID
    - 每个 command 有 op
    - 每个 command 有 target
    - 每个 command 有 params
    - 每个 command 有 version
  - [x] [P0-D-002] 实现 Command 执行器
    - 可以执行单条 command
    - 可以执行 command list
    - 非法 command 返回 validation error
  - [x] [P0-D-003] 实现 Command Replay
    - 可以从空项目 replay 到当前状态
    - replay 结果和保存前一致
  - [ ] [P0-D-004] 实现 Undo / Redo
    - 像素绘制可撤销
    - 体素绘制可撤销
    - 连续绘制可合并为一个操作
  - [x] [P0-D-005] 定义 AI 可生成命令的限制
    - AI 只能生成已注册 op
    - AI 生成 command 前必须校验参数
    - AI 不直接修改二进制导出文件

## P0-E：导出预设

- [x] [P0-E-000] 建立统一 ExportPreset 系统 #epic #export #phase-0 #P0
  - [x] [P0-E-001] 创建 ExportPreset
  - [x] [P0-E-002] 设置导出目标资产
  - [x] [P0-E-003] 设置导出格式
  - [x] [P0-E-004] 设置输出路径
  - [x] [P0-E-005] 设置缩放、透明、padding 等通用选项
  - [x] [P0-E-006] 后续 PNG / VOX / GLB / Sprite / Render 都复用该系统

## P0-F：开源项目调研与下载清单

- [x] [P0-F-000] 建立开源参考项目库 #epic #phase-0 #P0
  - [x] [P0-F-001] 创建本地参考目录
    - 创建 `references/` 目录
    - 创建 `references/README.md`
    - 每个参考项目单独建立笔记
    - 每个参考项目记录用途、许可证、技术栈、可参考模块、不可复用风险
  - [x] [P0-F-002] 检查许可证与复用边界
    - 区分可学习架构、可复用代码、不可直接复用代码
    - 记录 MIT / Apache / GPL / 自定义许可证差异
    - GPL 项目默认只做架构参考，除非项目决定兼容 GPL
    - Source-available 但非开源项目不列入可复用代码来源
  - [x] [P0-F-003] 建立参考项目阅读模板
    - 项目名称
    - 仓库地址
    - 许可证
    - 技术栈
    - 重点阅读模块
    - 可借鉴设计
    - 不适合本项目的部分
    - 是否值得进一步拆解
- [ ] [P0-F-100] 下载 / 参考 2D 像素编辑项目 #feature #phase-0 #P0
  - [x] [P0-F-101] Pixelorama
    - 参考像素画布
    - 参考图层系统
    - 参考动画 timeline
    - 参考 sprite sheet / GIF / 视频导出
    - 参考 Godot 项目结构，但不必采用 Godot 技术栈
  - [x] [P0-F-102] LibreSprite
    - 参考 sprite / frame / layer 数据模型
    - 参考 onion skin
    - 参考动画预览
    - 参考像素工具组织方式
  - [ ] [P0-F-103] Piskel #deferred
    - 参考 Web 像素编辑器结构
    - 参考轻量化 UI
    - 参考 browser-based sprite workflow
    - 参考动画导出
  - [ ] [P0-F-104] Krita #deferred
    - 参考大型绘图软件的 layer / brush / animation 设计
    - 只做概念参考，不作为早期实现目标
  - [x] [P0-F-105] 记录 2D 项目调研结论
    - 哪些功能进入 Phase 1
    - 哪些功能进入 Phase 5
    - 哪些功能进入 Phase 9
    - 哪些功能明确不做
- [x] [P0-F-200] 下载 / 参考 3D 体素编辑项目 #feature #phase-0 #P0
  - [x] [P0-F-201] Goxel
    - 参考 voxel 数据结构
    - 参考 layer 支持
    - 参考多格式导入导出
    - 参考 MagicaVoxel / OBJ / glTF 导出路径
  - [x] [P0-F-202] vengi
    - 参考 voxel editor 架构
    - 参考动画支持
    - 参考 CLI 工具
    - 参考多 voxel 格式转换
  - [x] [P0-F-203] Blockbench
    - 参考低模 / cuboid 建模交互
    - 参考 pixel art texture 工作流
    - 参考 model / texture / animation 的项目组织
    - 参考 Web / Electron 桌面化产品形态
  - [x] [P0-F-204] 记录 3D 项目调研结论
    - 哪些功能进入 Phase 2
    - 哪些功能进入 Phase 3
    - 哪些功能进入 Phase 6
    - 哪些功能进入 Phase 7
    - 哪些功能进入 Phase 8
- [ ] [P0-F-300] 下载 / 参考文件格式与导出项目 #feature #phase-0 #P0
  - [x] [P0-F-301] MagicaVoxel `.vox` 官方格式说明
    - 记录 RIFF-style chunk 结构
    - 记录 SIZE / XYZI / RGBA 等基础 chunk
    - 记录当前项目需要支持的最小 chunk 集合
    - 记录暂不支持的 chunk
  - [ ] [P0-F-302] ogt\_vox / OpenGameTools #deferred
    - 参考 `.vox` 读写
    - 参考 scene serialization
    - 参考导出后在 MagicaVoxel 中验证的方式
  - [x] [P0-F-303] glTF / GLB 规范
    - 记录 mesh / material / texture / animation 基础结构
    - 记录本项目导出 GLB 的最小支持范围
  - [x] [P0-F-304] pngjs
    - 参考 PNG 读写
    - 评估 Node 环境下是否适合使用
  - [ ] [P0-F-305] UPNG.js #deferred
    - [ ] 参考 PNG / APNG 编码解码
    - [ ] 评估 Web 环境下是否适合使用
  - [x] [P0-F-306] 记录导入导出调研结论
    - [ ] PNG 最小导入导出方案
    - [ ] VOX 最小导入导出方案
    - [ ] GLB 最小导入导出方案
    - [ ] Sprite Sheet / Metadata 最小导出方案
- [ ] [P0-F-400] 下载 / 参考 Scene / Editor / Runtime 项目 #feature #phase-0 #P1
  - [ ] [P0-F-401] Tiled #deferred
    - [ ] 参考 project / map / layer / object 数据模型
    - [ ] 参考属性系统
    - [ ] 参考通用编辑器 UI 组织
    - [ ] 参考稳定文件格式设计
  - [ ] [P0-F-402] Babylon.js Editor #deferred
    - [ ] 参考 3D scene editor
    - [ ] 参考 camera / light / material 面板
    - [ ] 参考 Web / Desktop 编辑器结构
  - [ ] [P0-F-403] Three.js Editor #deferred
    - [ ] 参考 WebGL 场景编辑器结构
    - [ ] 参考 scene hierarchy
    - [ ] 参考 transform gizmo
    - [ ] 参考导出流程
  - [x] [P0-F-404] 记录 Scene / Editor 调研结论
    - [ ] 哪些用于 Phase 3
    - [ ] 哪些用于 Phase 8
    - [ ] 哪些不适合早期实现
- [x] [P0-F-500] 建立参考项目阅读产物 #doc #phase-0 #P0
  - [x] [P0-F-501] 输出 `references/2d-pixel-editors.md`
  - [x] [P0-F-502] 输出 `references/3d-voxel-editors.md`
  - [x] [P0-F-503] 输出 `references/file-formats.md`
  - [x] [P0-F-504] 输出 `references/scene-editors.md`
  - [x] [P0-F-505] 输出 `references/license-review.md`
  - [x] [P0-F-506] 输出 `references/architecture-decisions.md`
  - [x] [P0-F-507] 从调研结果反向更新 Phase 1 / Phase 2 / Phase 4 的需求

***

# Phase 1：2D 像素绘制、PNG 导入导出

## P1-A：PixelAsset

- [x] [P1-A-000] 实现 2D PixelAsset #epic #phase-1 #P0
  - [x] [P1-A-001] 新建 PixelAsset
    - 可以设置宽度
    - 可以设置高度
    - 可以选择 Palette
    - 默认创建 Main Layer
  - [x] [P1-A-002] 保存 PixelAsset
    - 保存像素数据
    - 保存图层数据
    - 保存 Palette 引用
  - [x] [P1-A-003] 加载 PixelAsset
    - 加载后画面一致
    - 加载后可继续编辑

## P1-B：2D 画布

- [x] [P1-B-000] 实现 2D Pixel Canvas #feature #phase-1 #P0
  - [x] [P1-B-001] 显示像素画布
  - [x] [P1-B-002] 支持缩放
  - [x] [P1-B-003] 支持平移
  - [x] [P1-B-004] 显示像素网格
  - [x] [P1-B-005] 显示透明棋盘格
  - [x] [P1-B-006] 显示当前鼠标像素坐标

## P1-C：基础像素工具

- [x] [P1-C-000] 实现基础像素绘制工具 #feature #phase-1 #P0
  - [x] [P1-C-001] Pencil 单像素绘制
  - [x] [P1-C-002] Eraser 擦除
  - [x] [P1-C-003] Color Picker 取色
  - [x] [P1-C-004] Rectangle Fill 矩形填充
  - [x] [P1-C-005] Flood Fill 油漆桶
  - [x] [P1-C-006] Rect Select 矩形选择
  - [x] [P1-C-007] Move Selection 移动选区
  - [x] [P1-C-008] 所有工具接入 Undo / Redo
  - [x] [P1-C-009] 所有工具生成 command

## P1-D：2D 图层

- [x] [P1-D-000] 实现 Pixel Layer 系统 #feature #phase-1 #P1
  - [x] [P1-D-001] 创建图层
  - [x] [P1-D-002] 删除图层
  - [x] [P1-D-003] 重命名图层
  - [x] [P1-D-004] 调整图层顺序
  - [x] [P1-D-005] 显示 / 隐藏图层
  - [x] [P1-D-006] 锁定 / 解锁图层
  - [x] [P1-D-007] 导出时合成可见图层

## P1-E：PNG 导入导出

- [x] [P1-E-000] 支持 PNG 导入导出 #export #phase-1 #P0
  - [x] [P1-E-001] 导入 PNG 为新 PixelAsset
  - [x] [P1-E-002] 导入 PNG 为当前资产新图层
  - [x] [P1-E-003] 读取 PNG 透明度
  - [x] [P1-E-004] 保留原色导入
  - [x] [P1-E-005] 映射到当前 Palette 导入
  - [x] [P1-E-006] 导出当前合成图为 PNG
  - [x] [P1-E-007] 导出指定图层为 PNG
  - [x] [P1-E-008] 支持 1x / 2x / 4x nearest-neighbor 导出
  - [x] [P1-E-009] 支持透明背景导出

## P1-F：2D DSL

- [x] [P1-F-000] 定义 2D Pixel 命令 #dsl #phase-1 #P0
  - [x] [P1-F-001] create\_pixel\_asset
  - [x] [P1-F-002] paint\_pixel
  - [x] [P1-F-003] erase\_pixel
  - [x] [P1-F-004] fill\_rect
  - [x] [P1-F-005] flood\_fill
  - [x] [P1-F-006] create\_pixel\_layer
  - [x] [P1-F-007] delete\_pixel\_layer
  - [x] [P1-F-008] move\_pixel\_layer
  - [x] [P1-F-009] import\_png
  - [x] [P1-F-010] export\_png
  - [x] [P1-F-011] move\_selection
  - [x] [P1-F-012] rename\_pixel\_layer
  - [x] [P1-F-013] set\_pixel\_layer\_visibility
  - [x] [P1-F-014] set\_pixel\_layer\_lock

***

# Phase 2：3D 单一体素绘制、VOX 导入导出

## P2-A：VoxelAsset

- [ ] [P2-A-000] 实现单一 VoxelAsset #epic #phase-2 #P0
  - [ ] [P2-A-001] 新建 VoxelAsset
    - 设置 width
    - 设置 depth
    - 设置 height
    - 选择 Palette
  - [ ] [P2-A-002] 定义 VoxelCell
    - occupied
    - color
    - faces 预留六面颜色
  - [ ] [P2-A-003] 保存 VoxelAsset
  - [ ] [P2-A-004] 加载 VoxelAsset

## P2-B：3D 视图

- [ ] [P2-B-000] 实现 3D Voxel View #feature #phase-2 #P0
  - [ ] [P2-B-001] 显示 voxel grid
  - [ ] [P2-B-002] 显示坐标轴
  - [ ] [P2-B-003] 支持 orbit camera
  - [ ] [P2-B-004] 支持 pan
  - [ ] [P2-B-005] 支持 zoom
  - [ ] [P2-B-006] 支持 orthographic / perspective 切换
  - [ ] [P2-B-007] 鼠标 hover 可识别 voxel 或 grid position

## P2-C：基础体素工具

- [ ] [P2-C-000] 实现基础 voxel 编辑工具 #feature #phase-2 #P0
  - [ ] [P2-C-001] Add Voxel
  - [ ] [P2-C-002] Erase Voxel
  - [ ] [P2-C-003] Paint Voxel
  - [ ] [P2-C-004] Fill Box
  - [ ] [P2-C-005] Clear Box
  - [ ] [P2-C-006] Paint Box
  - [ ] [P2-C-007] Slice View
  - [ ] [P2-C-008] Mirror Drawing
  - [ ] [P2-C-009] Volume Select
  - [ ] [P2-C-010] Move Selected Volume
  - [ ] [P2-C-011] Duplicate Selected Volume
  - [ ] [P2-C-012] 所有操作接入 Undo / Redo
  - [ ] [P2-C-013] 所有操作生成 command

## P2-D：VOX 导入导出

- [ ] [P2-D-000] 支持 MagicaVoxel `.vox` 导入导出 #export #phase-2 #P0
  - [ ] [P2-D-001] 读取 `.vox` size
  - [ ] [P2-D-002] 读取 voxel positions
  - [ ] [P2-D-003] 读取 palette
  - [ ] [P2-D-004] 转换 MagicaVoxel 坐标
  - [ ] [P2-D-005] 导入为 VoxelAsset
  - [ ] [P2-D-006] 导出单个 VoxelAsset 为 `.vox`
  - [ ] [P2-D-007] 导出 palette
  - [ ] [P2-D-008] face-color voxel 导出时降级为单色 voxel
  - [ ] [P2-D-009] 导出的 `.vox` 可在 MagicaVoxel 中打开

## P2-E：3D DSL

- [ ] [P2-E-000] 定义 3D Voxel 命令 #dsl #phase-2 #P0
  - [ ] [P2-E-001] create\_voxel\_asset
  - [ ] [P2-E-002] paint\_voxel
  - [ ] [P2-E-003] erase\_voxel
  - [ ] [P2-E-004] fill\_box
  - [ ] [P2-E-005] clear\_box
  - [ ] [P2-E-006] paint\_box
  - [ ] [P2-E-007] mirror\_voxels
  - [ ] [P2-E-008] move\_voxels
  - [ ] [P2-E-009] import\_vox
  - [ ] [P2-E-010] export\_vox

***

# Phase 3：3D 多体素资产管理

## P3-A：Asset Browser

- [ ] [P3-A-000] 实现 Asset Browser #epic #phase-3 #P0
  - [ ] [P3-A-001] 显示所有资产
  - [ ] [P3-A-002] 按资产类型筛选
  - [ ] [P3-A-003] 搜索资产名
  - [ ] [P3-A-004] 重命名资产
  - [ ] [P3-A-005] 复制资产
  - [ ] [P3-A-006] 删除资产
  - [ ] [P3-A-007] 删除被引用资产时提示 warning
  - [ ] [P3-A-008] 显示基础缩略图

## P3-B：SceneAsset

- [ ] [P3-B-000] 实现 SceneAsset #epic #phase-3 #P0
  - [ ] [P3-B-001] 新建 SceneAsset
  - [ ] [P3-B-002] 保存 SceneAsset
  - [ ] [P3-B-003] 加载 SceneAsset
  - [ ] [P3-B-004] SceneAsset 包含 instance 列表
  - [ ] [P3-B-005] SceneAsset 包含 group / hierarchy
  - [ ] [P3-B-006] SceneAsset 出现在 Asset Browser

## P3-C：Instance 系统

- [ ] [P3-C-000] 实现 VoxelAsset Instance #feature #phase-3 #P0
  - [ ] [P3-C-001] 将 VoxelAsset 添加到 Scene
  - [ ] [P3-C-002] Instance 支持 position
  - [ ] [P3-C-003] Instance 支持 rotation
  - [ ] [P3-C-004] Instance 支持 scale
  - [ ] [P3-C-005] Instance 支持 pivot
  - [ ] [P3-C-006] 修改源资产后 instance 自动更新
  - [ ] [P3-C-007] 预留 instance override 数据结构
  - [ ] [P3-C-008] 删除 instance

## P3-D：Group / Outliner

- [ ] [P3-D-000] 实现 Group、Hierarchy、Outliner #feature #phase-3 #P1
  - [ ] [P3-D-001] 创建 group
  - [ ] [P3-D-002] 将 instance 加入 group
  - [ ] [P3-D-003] 解除 group
  - [ ] [P3-D-004] Outliner 显示层级
  - [ ] [P3-D-005] Outliner 选择对象
  - [ ] [P3-D-006] Group transform
  - [ ] [P3-D-007] 锁定 / 隐藏 group 或 instance

## P3-E：合并与拆分

- [ ] [P3-E-000] 实现资产合并与拆分 #feature #phase-3 #P1
  - [ ] [P3-E-001] 多个 instance merge 为一个 VoxelAsset
  - [ ] [P3-E-002] 选中 volume extract 为新 VoxelAsset
  - [ ] [P3-E-003] merge 时处理 palette
  - [ ] [P3-E-004] merge 时处理 transform
  - [ ] [P3-E-005] extract 后新资产出现在 Asset Browser

## P3-F：Scene DSL

- [ ] [P3-F-000] 定义 Scene / Instance 命令 #dsl #phase-3 #P0
  - [ ] [P3-F-001] create\_scene
  - [ ] [P3-F-002] add\_instance
  - [ ] [P3-F-003] remove\_instance
  - [ ] [P3-F-004] set\_transform
  - [ ] [P3-F-005] set\_pivot
  - [ ] [P3-F-006] group\_instances
  - [ ] [P3-F-007] ungroup\_instances
  - [ ] [P3-F-008] merge\_assets
  - [ ] [P3-F-009] extract\_asset
  - [ ] [P3-F-010] export\_scene

***

# Phase 4：2D 到 3D 投影、PixZels-like、拉伸建模

## P4-A：Projection Layer

- [ ] [P4-A-000] 实现 Projection Layer #epic #phase-4 #P0
  - [ ] [P4-A-001] VoxelAsset 可添加 ProjectionLayer
  - [ ] [P4-A-002] ProjectionLayer 引用 Front PixelAsset
  - [ ] [P4-A-003] ProjectionLayer 引用 Side PixelAsset
  - [ ] [P4-A-004] ProjectionLayer 引用 Top PixelAsset
  - [ ] [P4-A-005] ProjectionLayer 保存 solver 参数
  - [ ] [P4-A-006] ProjectionLayer 可实时预览
  - [ ] [P4-A-007] ProjectionLayer 不直接破坏普通 voxel layer

## P4-B：PixZels-like 三视图生成

- [ ] [P4-B-000] 实现三视图投影 Solver #feature #phase-4 #P0
  - [ ] [P4-B-001] 支持 Front + Side + Top
  - [ ] [P4-B-002] 支持 Front + Side
  - [ ] [P4-B-003] 支持 Front + Depth
  - [ ] [P4-B-004] 透明像素表示空约束
  - [ ] [P4-B-005] 非透明像素表示占用约束
  - [ ] [P4-B-006] 输出 voxel occupancy
  - [ ] [P4-B-007] 尺寸不匹配时提示错误
  - [ ] [P4-B-008] 支持实时 preview

## P4-C：六面着色 Voxel

- [ ] [P4-C-000] 支持 Face-colored Voxel 输出 #feature #phase-4 #P0
  - [ ] [P4-C-001] Front view 颜色写入 front face
  - [ ] [P4-C-002] Side view 颜色写入 side face
  - [ ] [P4-C-003] Top view 颜色写入 top face
  - [ ] [P4-C-004] 定义颜色冲突规则
  - [ ] [P4-C-005] 支持 fallback 到单色 voxel
  - [ ] [P4-C-006] face-color 信息可保存
  - [ ] [P4-C-007] face-color 导出 VOX 时可降级

## P4-D：Component Projection

- [ ] [P4-D-000] 实现多 Component 投影 #feature #phase-4 #P0
  - [ ] [P4-D-001] 创建 projection component
  - [ ] [P4-D-002] 每个 component 绑定独立三视图
  - [ ] [P4-D-003] 每个 component 独立 solver
  - [ ] [P4-D-004] 每个 component 支持 transform
  - [ ] [P4-D-005] 多 component 合并预览
  - [ ] [P4-D-006] component 可 freeze 为 voxel layer
  - [ ] [P4-D-007] component 可 freeze 为 VoxelAsset

## P4-E：Freeze

- [ ] [P4-E-000] 实现 Projection Freeze #feature #phase-4 #P0
  - [ ] [P4-E-001] ProjectionLayer 固化为普通 VoxelLayer
  - [ ] [P4-E-002] 固化时保留颜色
  - [ ] [P4-E-003] 固化时保留 face-color
  - [ ] [P4-E-004] 固化不删除原 ProjectionLayer，除非用户选择
  - [ ] [P4-E-005] 固化操作可 undo
  - [ ] [P4-E-006] 固化后可以手工编辑 voxel

## P4-F：拉伸建模

- [ ] [P4-F-000] 实现 2D Pixel Mask Extrude #feature #phase-4 #P0
  - [ ] [P4-F-001] 选择 PixelAsset 作为 mask
  - [ ] [P4-F-002] 选择 pixel selection 作为 mask
  - [ ] [P4-F-003] 选择拉伸轴 x / y / z
  - [ ] [P4-F-004] 设置 depth
  - [ ] [P4-F-005] Add 模式
  - [ ] [P4-F-006] Cut 模式
  - [ ] [P4-F-007] Symmetric extrude
  - [ ] [P4-F-008] 拉伸前预览
  - [ ] [P4-F-009] 拉伸操作生成 command

## P4-G：Voxel Boolean

- [ ] [P4-G-000] 实现 Voxel Boolean #feature #phase-4 #P1
  - [ ] [P4-G-001] boolean\_add
  - [ ] [P4-G-002] boolean\_subtract
  - [ ] [P4-G-003] boolean\_intersect
  - [ ] [P4-G-004] boolean preview
  - [ ] [P4-G-005] boolean 操作支持 undo

## P4-H：Revolve / Sweep 验证

- [ ] [P4-H-000] 验证简化 Revolve / Sweep #spike #phase-4 #P2
  - [ ] [P4-H-001] 2D 轮廓绕轴旋转成 voxel
  - [ ] [P4-H-002] 2D 截面沿简单路径 sweep 成 voxel
  - [ ] [P4-H-003] 评估像素风可用性
  - [ ] [P4-H-004] 若质量不足则延后

## P4-I：Projection DSL

- [ ] [P4-I-000] 定义 Projection / Extrude 命令 #dsl #phase-4 #P0
  - [ ] [P4-I-001] create\_projection\_layer
  - [ ] [P4-I-002] bind\_projection\_view
  - [ ] [P4-I-003] solve\_projection
  - [ ] [P4-I-004] freeze\_projection
  - [ ] [P4-I-005] extrude\_pixels
  - [ ] [P4-I-006] revolve\_pixels
  - [ ] [P4-I-007] sweep\_pixels
  - [ ] [P4-I-008] boolean\_add
  - [ ] [P4-I-009] boolean\_subtract
  - [ ] [P4-I-010] boolean\_intersect
  - [ ] [P4-I-011] set\_face\_color

***

# Phase 5：2D 动画

## P5-A：Animation2D

- [ ] [P5-A-000] 实现 2D AnimationAsset #epic #phase-5 #P1
  - [ ] [P5-A-001] 新建 Animation2D
  - [ ] [P5-A-002] 设置 width / height
  - [ ] [P5-A-003] 设置 fps
  - [ ] [P5-A-004] 绑定 Palette
  - [ ] [P5-A-005] 引用 PixelAsset 作为 frame cel
  - [ ] [P5-A-006] Animation2D 出现在 Asset Browser

## P5-B：Timeline

- [ ] [P5-B-000] 实现 2D Timeline #feature #phase-5 #P1
  - [ ] [P5-B-001] 添加 frame
  - [ ] [P5-B-002] 删除 frame
  - [ ] [P5-B-003] 复制 frame
  - [ ] [P5-B-004] 调整 frame 顺序
  - [ ] [P5-B-005] 设置 frame duration
  - [ ] [P5-B-006] 复用 cel
  - [ ] [P5-B-007] Timeline UI 显示 frame 列表

## P5-C：播放与 Onion Skin

- [ ] [P5-C-000] 实现动画播放和 Onion Skin #feature #phase-5 #P1
  - [ ] [P5-C-001] 播放动画
  - [ ] [P5-C-002] 暂停动画
  - [ ] [P5-C-003] 循环播放
  - [ ] [P5-C-004] 显示当前帧
  - [ ] [P5-C-005] 显示前一帧 onion skin
  - [ ] [P5-C-006] 显示后一帧 onion skin
  - [ ] [P5-C-007] 调整 onion skin 透明度

## P5-D：2D 动画导出

- [ ] [P5-D-000] 导出 2D 动画 #export #phase-5 #P1
  - [ ] [P5-D-001] 导出 sprite sheet
  - [ ] [P5-D-002] 横排布局
  - [ ] [P5-D-003] 竖排布局
  - [ ] [P5-D-004] grid 布局
  - [ ] [P5-D-005] 导出 PNG sequence
  - [ ] [P5-D-006] 导出 GIF 预览
  - [ ] [P5-D-007] 导出 JSON metadata
  - [ ] [P5-D-008] metadata 包含 frame rect
  - [ ] [P5-D-009] metadata 包含 duration
  - [ ] [P5-D-010] metadata 包含 pivot

## P5-E：Animation2D DSL

- [ ] [P5-E-000] 定义 2D Animation 命令 #dsl #phase-5 #P1
  - [ ] [P5-E-001] create\_2d\_animation
  - [ ] [P5-E-002] add\_frame
  - [ ] [P5-E-003] delete\_frame
  - [ ] [P5-E-004] duplicate\_frame
  - [ ] [P5-E-005] set\_frame\_duration
  - [ ] [P5-E-006] set\_frame\_asset
  - [ ] [P5-E-007] export\_sprite\_sheet
  - [ ] [P5-E-008] export\_gif
  - [ ] [P5-E-009] export\_png\_sequence

***

# Phase 6：2D 资产作为 3D 贴图

## P6-A：Face Texture 数据

- [ ] [P6-A-000] 定义 voxel face texture #epic #phase-6 #P1
  - [ ] [P6-A-001] voxel face 可引用 PixelAsset
  - [ ] [P6-A-002] plane 区域可引用 PixelAsset
  - [ ] [P6-A-003] 支持 face UV / rect 映射
  - [ ] [P6-A-004] 支持 texture layer
  - [ ] [P6-A-005] 支持 fallback 到 face-color
  - [ ] [P6-A-006] face texture 可保存到项目

## P6-B：贴图绑定

- [ ] [P6-B-000] 将 2D PixelAsset 绑定到 3D 表面 #feature #phase-6 #P1
  - [ ] [P6-B-001] 选择 VoxelAsset 表面区域
  - [ ] [P6-B-002] 选择 PixelAsset 作为 texture
  - [ ] [P6-B-003] 设置 texture rect
  - [ ] [P6-B-004] 设置 UV 方向
  - [ ] [P6-B-005] 预览贴图结果
  - [ ] [P6-B-006] 移除贴图绑定

## P6-C：Texture Projection / Bake

- [ ] [P6-C-000] 实现贴图投射与烘焙 #feature #phase-6 #P1
  - [ ] [P6-C-001] 从 front 投射贴图
  - [ ] [P6-C-002] 从 side 投射贴图
  - [ ] [P6-C-003] 从 top 投射贴图
  - [ ] [P6-C-004] texture bake 到 face-color
  - [ ] [P6-C-005] bake 前预览
  - [ ] [P6-C-006] bake 后不依赖源 PixelAsset
  - [ ] [P6-C-007] bake 操作可 undo

## P6-D：改进 3D 导出

- [ ] [P6-D-000] 实现 GLB / OBJ 导出 #export #phase-6 #P1
  - [ ] [P6-D-001] 导出 GLB
  - [ ] [P6-D-002] 导出 OBJ
  - [ ] [P6-D-003] 导出材质
  - [ ] [P6-D-004] 导出 texture atlas
  - [ ] [P6-D-005] 合并相邻面优化 mesh
  - [ ] [P6-D-006] 导出 pivot / scale metadata
  - [ ] [P6-D-007] 导出的 GLB 可在 Blender 或引擎中打开

## P6-E：3D 到 Sprite 渲染导出

- [ ] [P6-E-000] 从 3D voxel 渲染多角度 sprite #export #phase-6 #P1
  - [ ] [P6-E-001] 4 方向导出
  - [ ] [P6-E-002] 8 方向导出
  - [ ] [P6-E-003] 16 方向导出
  - [ ] [P6-E-004] orthographic camera
  - [ ] [P6-E-005] 透明背景
  - [ ] [P6-E-006] sprite sheet 输出
  - [ ] [P6-E-007] JSON metadata

## P6-F：Texture / Export DSL

- [ ] [P6-F-000] 定义 2D 贴图驱动 3D 命令 #dsl #phase-6 #P1
  - [ ] [P6-F-001] assign\_texture\_to\_face
  - [ ] [P6-F-002] assign\_texture\_to\_plane
  - [ ] [P6-F-003] project\_texture
  - [ ] [P6-F-004] bake\_texture\_to\_faces
  - [ ] [P6-F-005] create\_texture\_atlas
  - [ ] [P6-F-006] export\_glb
  - [ ] [P6-F-007] export\_obj
  - [ ] [P6-F-008] export\_voxel\_sprites
  - [ ] [P6-F-009] optimize\_mesh

***

# Phase 7：3D 帧动画

## P7-A：Animation3D

- [ ] [P7-A-000] 实现 3D AnimationAsset #epic #phase-7 #P2
  - [ ] [P7-A-001] 新建 Animation3D
  - [ ] [P7-A-002] 绑定 VoxelAsset
  - [ ] [P7-A-003] 绑定 SceneAsset
  - [ ] [P7-A-004] 设置 fps
  - [ ] [P7-A-005] 设置 frame count
  - [ ] [P7-A-006] Animation3D 出现在 Asset Browser

## P7-B：Component Transform Animation

- [ ] [P7-B-000] 实现 3D component transform 动画 #feature #phase-7 #P2
  - [ ] [P7-B-001] position key
  - [ ] [P7-B-002] rotation key
  - [ ] [P7-B-003] scale key
  - [ ] [P7-B-004] visibility key
  - [ ] [P7-B-005] Timeline 显示 keyframe
  - [ ] [P7-B-006] 支持插值模式
  - [ ] [P7-B-007] 支持预览播放

## P7-C：Frame-based Voxel Animation

- [ ] [P7-C-000] 实现逐帧 voxel 动画 #feature #phase-7 #P2
  - [ ] [P7-C-001] 每帧保存完整 voxel state
  - [ ] [P7-C-002] 支持 delta frame 存储方案
  - [ ] [P7-C-003] 复制 frame
  - [ ] [P7-C-004] 编辑单帧 voxel
  - [ ] [P7-C-005] 3D onion skin
  - [ ] [P7-C-006] 预览播放

## P7-D：3D 动画导出

- [ ] [P7-D-000] 导出 3D 动画 #export #phase-7 #P2
  - [ ] [P7-D-001] 导出 PNG sequence
  - [ ] [P7-D-002] 导出 sprite sheet
  - [ ] [P7-D-003] 指定相机角度
  - [ ] [P7-D-004] 指定输出分辨率
  - [ ] [P7-D-005] 导出 metadata
  - [ ] [P7-D-006] 透明背景
  - [ ] [P7-D-007] VOX sequence
  - [ ] [P7-D-008] GLB animation

## P7-E：Animation3D DSL

- [ ] [P7-E-000] 定义 3D Animation 命令 #dsl #phase-7 #P2
  - [ ] [P7-E-001] create\_3d\_animation
  - [ ] [P7-E-002] add\_3d\_frame
  - [ ] [P7-E-003] set\_voxel\_frame
  - [ ] [P7-E-004] set\_instance\_transform\_key
  - [ ] [P7-E-005] set\_visibility\_key
  - [ ] [P7-E-006] add\_animation\_event
  - [ ] [P7-E-007] export\_3d\_sprite\_sheet
  - [ ] [P7-E-008] export\_vox\_sequence
  - [ ] [P7-E-009] export\_glb\_animation

***

# Phase 8：3D 渲染器

## P8-A：RenderScene

- [ ] [P8-A-000] 实现独立 RenderScene #epic #phase-8 #P2
  - [ ] [P8-A-001] 新建 RenderScene
  - [ ] [P8-A-002] RenderScene 引用 VoxelAsset
  - [ ] [P8-A-003] RenderScene 引用 SceneAsset
  - [ ] [P8-A-004] RenderScene 独立于编辑 Scene
  - [ ] [P8-A-005] 保存 camera
  - [ ] [P8-A-006] 保存 light
  - [ ] [P8-A-007] 保存 background
  - [ ] [P8-A-008] 保存 ground plane

## P8-B：Camera

- [ ] [P8-B-000] 实现渲染相机 #feature #phase-8 #P2
  - [ ] [P8-B-001] orthographic camera
  - [ ] [P8-B-002] perspective camera
  - [ ] [P8-B-003] isometric preset
  - [ ] [P8-B-004] 设置 position / target
  - [ ] [P8-B-005] 设置 orthographic size
  - [ ] [P8-B-006] 设置 FOV
  - [ ] [P8-B-007] 保存 camera preset

## P8-C：Lighting

- [ ] [P8-C-000] 实现灯光系统 #feature #phase-8 #P2
  - [ ] [P8-C-001] directional light
  - [ ] [P8-C-002] point light
  - [ ] [P8-C-003] area light 或 soft light
  - [ ] [P8-C-004] ambient light
  - [ ] [P8-C-005] shadow
  - [ ] [P8-C-006] soft shadow
  - [ ] [P8-C-007] light color / intensity
  - [ ] [P8-C-008] light preset

## P8-D：Material

- [ ] [P8-D-000] 实现渲染材质 #feature #phase-8 #P2
  - [ ] [P8-D-001] MaterialAsset
  - [ ] [P8-D-002] baseColor
  - [ ] [P8-D-003] roughness
  - [ ] [P8-D-004] metallic
  - [ ] [P8-D-005] emissionColor
  - [ ] [P8-D-006] emissionStrength
  - [ ] [P8-D-007] opacity
  - [ ] [P8-D-008] Palette color 绑定 material
  - [ ] [P8-D-009] voxel face 绑定 material
  - [ ] [P8-D-010] Pixel texture 作为 material input

## P8-E：MagicaVoxel-like Render Effects

- [ ] [P8-E-000] 实现 MagicaVoxel-like 渲染效果 #feature #phase-8 #P2
  - [ ] [P8-E-001] Ambient Occlusion
  - [ ] [P8-E-002] Soft Shadow
  - [ ] [P8-E-003] Bloom
  - [ ] [P8-E-004] Depth of Field
  - [ ] [P8-E-005] Outline Render
  - [ ] [P8-E-006] Pixelated Render
  - [ ] [P8-E-007] Clay Render
  - [ ] [P8-E-008] Effects 可保存到 render preset

## P8-F：渲染导出

- [ ] [P8-F-000] 实现渲染导出 #export #phase-8 #P2
  - [ ] [P8-F-001] 渲染 PNG
  - [ ] [P8-F-002] 透明背景
  - [ ] [P8-F-003] 指定分辨率
  - [ ] [P8-F-004] 指定 render preset
  - [ ] [P8-F-005] shadow catcher / ground plane
  - [ ] [P8-F-006] alpha 正确输出
  - [ ] [P8-F-007] depth map
  - [ ] [P8-F-008] normal map
  - [ ] [P8-F-009] object mask
  - [ ] [P8-F-010] material mask
  - [ ] [P8-F-011] shadow pass

## P8-G：Turntable / 多角度导出

- [ ] [P8-G-000] 实现转台和多角度渲染 #export #phase-8 #P2
  - [ ] [P8-G-001] turntable PNG sequence
  - [ ] [P8-G-002] turntable GIF
  - [ ] [P8-G-003] turntable MP4 / WebM
  - [ ] [P8-G-004] 4 方向 sprite render
  - [ ] [P8-G-005] 8 方向 sprite render
  - [ ] [P8-G-006] 16 方向 sprite render
  - [ ] [P8-G-007] 批量资产缩略图渲染

## P8-H：Renderer DSL

- [ ] [P8-H-000] 定义 Renderer 命令 #dsl #phase-8 #P2
  - [ ] [P8-H-001] create\_render\_scene
  - [ ] [P8-H-002] add\_render\_instance
  - [ ] [P8-H-003] set\_render\_camera
  - [ ] [P8-H-004] set\_render\_background
  - [ ] [P8-H-005] set\_ground\_plane
  - [ ] [P8-H-006] add\_light
  - [ ] [P8-H-007] set\_light
  - [ ] [P8-H-008] remove\_light
  - [ ] [P8-H-009] create\_material
  - [ ] [P8-H-010] assign\_material
  - [ ] [P8-H-011] render\_png
  - [ ] [P8-H-012] render\_turntable
  - [ ] [P8-H-013] render\_sprite\_angles
  - [ ] [P8-H-014] render\_pass
  - [ ] [P8-H-015] batch\_render\_thumbnails

***

# Phase 9：2D 发光资产

## P9-A：Emissive Pixel 数据

- [ ] [P9-A-000] 实现 2D 发光像素数据 #epic #phase-9 #P2
  - [ ] [P9-A-001] PixelAsset 支持 emissionColor
  - [ ] [P9-A-002] PixelAsset 支持 emissionStrength
  - [ ] [P9-A-003] 支持独立 emission layer
  - [ ] [P9-A-004] 支持 glow mask
  - [ ] [P9-A-005] 支持 palette-based emission
  - [ ] [P9-A-006] 发光数据可保存到 project
  - [ ] [P9-A-007] 旧 PixelAsset 可升级为 emissive-capable asset

## P9-B：Glow 编辑工具

- [ ] [P9-B-000] 实现发光绘制工具 #feature #phase-9 #P2
  - [ ] [P9-B-001] Glow Brush
  - [ ] [P9-B-002] 设置 emission color
  - [ ] [P9-B-003] 设置 emission strength
  - [ ] [P9-B-004] 擦除 emission
  - [ ] [P9-B-005] 查看 glow mask
  - [ ] [P9-B-006] 从 base layer 复制到 emission layer
  - [ ] [P9-B-007] 指定 palette color 自动发光

## P9-C：Glow Preview

- [ ] [P9-C-000] 实现 2D 发光预览 #feature #phase-9 #P2
  - [ ] [P9-C-001] 2D canvas 实时预览 glow
  - [ ] [P9-C-002] 开关 glow preview
  - [ ] [P9-C-003] bloom radius
  - [ ] [P9-C-004] bloom intensity
  - [ ] [P9-C-005] threshold
  - [ ] [P9-C-006] pixel-perfect bloom
  - [ ] [P9-C-007] soft bloom
  - [ ] [P9-C-008] 2D 动画播放时预览发光

## P9-D：发光资产用于 3D

- [ ] [P9-D-000] 发光 PixelAsset 可用于 3D texture 和 renderer #feature #phase-9 #P2
  - [ ] [P9-D-001] PixelAsset 提供 base texture
  - [ ] [P9-D-002] PixelAsset 提供 emission texture
  - [ ] [P9-D-003] PixelAsset 提供 glow mask
  - [ ] [P9-D-004] Face texture 可引用 emission 数据
  - [ ] [P9-D-005] GLB 导出生成 emissive texture
  - [ ] [P9-D-006] RenderScene 识别 emissive texture 并产生 bloom

## P9-E：Glow 导出

- [ ] [P9-E-000] 导出发光 2D 资产 #export #phase-9 #P2
  - [ ] [P9-E-001] base PNG
  - [ ] [P9-E-002] emission PNG
  - [ ] [P9-E-003] glow mask PNG
  - [ ] [P9-E-004] baked glow PNG
  - [ ] [P9-E-005] base sprite sheet
  - [ ] [P9-E-006] emission sprite sheet
  - [ ] [P9-E-007] JSON metadata
  - [ ] [P9-E-008] premultiplied alpha 选项
  - [ ] [P9-E-009] engine-ready export preset

## P9-F：Glow DSL

- [ ] [P9-F-000] 定义 Glow 命令 #dsl #phase-9 #P2
  - [ ] [P9-F-001] create\_emissive\_pixel\_asset
  - [ ] [P9-F-002] set\_pixel\_emission
  - [ ] [P9-F-003] paint\_emission
  - [ ] [P9-F-004] clear\_emission
  - [ ] [P9-F-005] set\_emission\_strength
  - [ ] [P9-F-006] set\_emission\_color
  - [ ] [P9-F-007] create\_glow\_mask
  - [ ] [P9-F-008] bake\_glow
  - [ ] [P9-F-009] export\_emission\_png
  - [ ] [P9-F-010] export\_glow\_mask
  - [ ] [P9-F-011] export\_baked\_glow\_png
  - [ ] [P9-F-012] export\_sprite\_sheet\_with\_emission

***

# Cross-Cutting：质量、测试、文档

## X-A：AI 追踪规则

- [x] [X-A-000] 保持需求对 AI 可追踪 #qa #P0
  - [x] [X-A-001] 每个需求有稳定 ID
  - [x] [X-A-002] AI 修改时不得删除 ID
  - [x] [X-A-003] AI 完成任务时勾选 checkbox
  - [x] [X-A-004] AI 拆分任务时新增子 ID
  - [x] [X-A-005] AI 延后任务时标记 `#deferred`
  - [x] [X-A-006] AI 阻塞任务时标记 `#blocked`
  - [x] [X-A-007] AI 取消任务时标记 `#cut`
  - [x] [X-A-008] 每次任务执行创建一个 log
  - [x] [X-A-009] log 包含用户原始 prompt
  - [x] [X-A-010] log 包含任务执行开始时间和结束时间

## X-B：Definition of Done

- [x] [X-B-000] 全局完成标准 #qa #P0
  - [x] [X-B-001] 功能完成
  - [x] [X-B-002] UI 可操作
  - [x] [X-B-003] Command 已接入
  - [x] [X-B-004] Undo / Redo 可用，若适用
  - [x] [X-B-005] Save / Load 可恢复结果
  - [x] [X-B-006] 有至少一个测试资产验证
  - [x] [X-B-007] 有手动测试步骤
  - [x] [X-B-008] 错误输入有 validation 或 warning
  - [x] [X-B-009] 不破坏已有阶段验收

## X-C：测试资产

- [ ] [X-C-000] 建立测试资产集 #qa #P1
  - [ ] [X-C-001] Simple Crate
  - [ ] [X-C-002] Door
  - [ ] [X-C-003] Pipe
  - [ ] [X-C-004] Character Dummy
  - [ ] [X-C-005] Neon Sign
  - [ ] [X-C-006] Arcade Machine
  - [ ] [X-C-007] Voxel Room
  - [ ] [X-C-008] 8-direction Sprite Test
  - [ ] [X-C-009] Glow Animation Test

## X-D：性能基准

- [ ] [X-D-000] 建立性能基准 #qa #P2
  - [ ] [X-D-001] 32×32 PixelAsset 绘制无明显延迟
  - [ ] [X-D-002] 128×128 PixelAsset 基础操作可接受
  - [ ] [X-D-003] 32×32×32 VoxelAsset 编辑可实时
  - [ ] [X-D-004] 128×128×128 VoxelAsset 至少可查看和导出
  - [ ] [X-D-005] Projection solver 常用尺寸可交互预览
  - [ ] [X-D-006] Batch render 有进度提示
  - [ ] [X-D-007] 大型操作可取消

## X-E：用户文档

- [ ] [X-E-000] 编写用户文档 #doc #P2
  - [ ] [X-E-001] Quick Start
  - [ ] [X-E-002] 2D PixelAsset 教程
  - [ ] [X-E-003] VoxelAsset 教程
  - [ ] [X-E-004] Projection Layer 教程
  - [ ] [X-E-005] Export Preset 教程
  - [ ] [X-E-006] AI Command 示例
  - [ ] [X-E-007] 每个主要阶段有示例文件

## X-F：Agent 启动模板

- [x] [X-F-000] 建立可复制的 Agent 启动模板 #doc #P1
  - [x] [X-F-001] 输出 `reference/agent-template/agents.md`
  - [x] [X-F-002] 输出 `reference/agent-template/requirements.md`
  - [x] [X-F-003] 输出 `reference/agent-template/design.md`
  - [x] [X-F-004] 输出 `reference/agent-template/agent-log/templatelog.md`
  - [x] [X-F-005] 模板说明每次任务执行必须创建 log
  - [x] [X-F-006] 模板说明必须严格更新 requirements
  - [x] [X-F-007] 模板 log 包含用户原始 prompt、开始时间、结束时间
