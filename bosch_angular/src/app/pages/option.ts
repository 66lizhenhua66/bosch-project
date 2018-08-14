export const STATIONS = [
    {
        station_name: 'ST10',
        steps: [
            {step_name: "拿取并扫描标牌", is_auto: false},
            {step_name: "PTL-拿取并装配弹性挡圈", is_auto: false},
            {step_name: "粘贴标牌", is_auto: false},
            {step_name: "PTL-安装壳体双头断堵", is_auto: false},
            {step_name: "后盖单向阀手动安装-销子", is_auto: false},
            {step_name: "后盖单向阀手动安装-阀座", is_auto: false},
            {step_name: "后盖单向阀手动安装-阀芯", is_auto: false},
            {step_name: "手动放行壳体托盘到压机位置", is_auto: false},
            {step_name: "PTL-拿取轴承外环垫片", is_auto: false},
            {step_name: "拿取并安装前轴承外环以及轴封", is_auto: false},
            {step_name: "压机压装并合格自动放行", is_auto: true},
            {step_name: "后盖装垫片", is_auto: false},
            {step_name: "更换压机头拿取并安装后轴承外环", is_auto: false},
            // {step_name: "压机压装并合格自动放行", is_auto: false},
        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
    {
        station_name: 'ST20',
        steps: [
            {step_name: "拿取并安装5X半圆导轨", is_auto: false},
            {step_name: "拿取并安装6X半圆导轨", is_auto: false},
            {step_name: "PTL-拿取并安装轨道螺钉", is_auto: false},
            {step_name: "适配器安装和螺塞安装", is_auto: false},
            {step_name: "安装涨销(壳体或后盖)", is_auto: false},
            {step_name: "PTL-手动安装弹簧到壳体", is_auto: false},
            {step_name: "手动安装斜盘进壳体(前后润滑_半圆导轨/斜盘)", is_auto: false},
            {step_name: "放大镜检查传动轴(有信号开关(放大镜))", is_auto: false},
            {step_name: "压装传动轴到前轴承", is_auto: true},
            {step_name: "再次检查放大镜检查传动轴(有信号开关(放大镜))", is_auto: false},
            {step_name: "使用轴封保护套(有信号开关)安装传动轴到壳体", is_auto: false},
            {step_name: "手动放行壳体托盘到下一工位", is_auto: false},
        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
    {
        station_name: 'ST30',
        steps: [
            {step_name: "自动测量轴向间隙", is_auto: true},
            {step_name: "拿取并安装3X半圆导轨", is_auto: false},
            {step_name: "拿取并安装3X斜盘(前后润滑_半圆导轨/斜盘)", is_auto: false},
            {step_name: "安装限位杆", is_auto: false},
            {step_name: "5X控制活塞杆及控制活塞安装", is_auto: false},
            {step_name: "手动安装弹簧到壳体", is_auto: false},
            {step_name: "手动安装斜盘进壳体(前后润滑_半圆导轨/斜盘)", is_auto: false},
        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
    {
        station_name: 'ST40',
        steps: [
            {step_name: "手动安装弹簧到壳体", is_auto: false},
            {step_name: "手动安装斜盘进壳体(前后润滑_半圆导轨/斜盘)", is_auto: false},
            {step_name: "安装壳体丝堵", is_auto: true},
            {step_name: "安装壳体管接头", is_auto: true},
            {step_name: "安装回转体以及调节垫片/后轴承（润滑）", is_auto: false},
            {step_name: "安装3X壳体大O 圈", is_auto: false},
            {step_name: "安装3X壳体大O 圈到壳体或安装5x/6x后盖大O 圈到后盖", is_auto: false},
            {step_name: "安装5X/6X壳体方圈", is_auto: false},
            {step_name: "5X功率阀/6X EP阀安装或丝堵安装（斜枪）", is_auto: false},
            {step_name: "PTL_安装后盖定位销", is_auto: false},
            {step_name: "PTL_安装后盖最大排量限位杆_3x", is_auto: false},
            {step_name: "PTL_安装后盖最小排量限位杆_3x", is_auto: false},
            {step_name: "拿取高压套/低压杆涂乐泰胶并安装_有乐泰胶信号_3x", is_auto: false},
            {step_name: "PTL_安装最大排量限位环以及活塞导向_3x", is_auto: false},
            {step_name: "安装最小排量限位环", is_auto: false},
            {step_name: "安装后盖小O圈_3X", is_auto: false},
            {step_name: "安装后盖大O圈_5x/6x", is_auto: false},
            {step_name: "拿取并安装配流盘（需要黄油）", is_auto: false},
            {step_name: "壳体和后盖进行拍照", is_auto: true},
            {step_name: "手动安装高压杆及高压杆弹簧_3x", is_auto: false},
            {step_name: "合后盖到壳体上", is_auto: false},
        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
    {
        station_name: 'ST50',
        steps: [
            {step_name: "合后盖到壳体上", is_auto: false},
            {step_name: "拿取并安装壳体后盖连接螺钉_(3X需要预紧）", is_auto: false},
            {step_name: "校核连接螺钉_电动扭矩扳手", is_auto: true},
            {step_name: "对于一些通轴驱动产品的两个钉需要手动力矩扳手校核", is_auto: false},
        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
    {
        station_name: 'ST60',
        steps: [
            {step_name: "安装最小排量限位杆或触止螺丝_5X/6x", is_auto: true},
            {step_name: "安装最小排量限位杆螺母帽及丝堵_3X", is_auto: true},
            {step_name: "安装内节流塞", is_auto: true},
            {step_name: "PTL_安装节流销", is_auto: false},
            {step_name: "安装外节流塞", is_auto: true},
            {step_name: "安装小丝堵（2个料盒）", is_auto: true},
            {step_name: "PTL_安装后盖双头断堵", is_auto: false},
            {step_name: "安装后盖丝堵", is_auto: true},
            {step_name: "PTL_安装后盖法兰定位销", is_auto: false},
            {step_name: "PTL_安装后盖密封法兰的O圈", is_auto: false},
            {step_name: "安装后盖 法兰盘", is_auto: false},
            {step_name: "安装8颗螺钉_用ST60_1的电枪", is_auto: true},
            {step_name: "轴套上要安装保护帽（1个料盒）", is_auto: false},
            {step_name: "安装联轴套", is_auto: false},
            {step_name: "PTL_安装后法兰上密封菱形盖板的O圈", is_auto: false},
            {step_name: "安装后盖 法兰菱形盖板及外六角", is_auto: false},

        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
    {
        station_name: 'ST70',
        steps: [
            {step_name: "安装偏心杆", is_auto: false},
            {step_name: "旋紧螺钉", is_auto: false},
            {step_name: "涂胶", is_auto: false},
            {step_name: "PTL_拿取功率阀垫片", is_auto: false},
            {step_name: "手动安装功率阀 3X", is_auto: false},
            {step_name: "校核功率阀螺钉_电动扭矩扳手", is_auto: true},
            {step_name: "PTL_拿取控制阀垫片", is_auto: false},
            {step_name: "手动安装控制阀(手动预紧)", is_auto: false},
            {step_name: "校核控制阀螺钉_电动扭矩扳手", is_auto: true},
            {step_name: "装配油管组件（10个料盒）", is_auto: false},
            {step_name: "将产品放到气密试验桌并盘轴", is_auto: false},
        ],
        stages: [
            "阶段名称1",
            "阶段名称2",
            "阶段名称3",
        ],
        tests: [
            "测试项名称1",
            "测试项名称2",
            "测试项名称3",
        ],
        precisions: [
            "1",
            "2",
            "3",
        ],
        comparisons: [
            ">=",
            "<=",
            "==",
        ],
        data_types: [
            "float",
            "double",
            "int",
        ]
    },
]
