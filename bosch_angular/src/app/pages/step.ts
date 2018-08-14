import { TestStep } from './test_step';


export class Auto {
    is_auto: boolean;
    step_name: string;
    pro_num: string;  // 程序号
    count: string;  // 数量
    left_pdf: string;  
    right_pdf: string;
    stage_name: string;  // 阶段名称
    model_number?: string;  // 枪头或套筒型号
    torque?: string;  // 枪头或套筒型号的力矩值
    test_steps: Array<TestStep>;  // 多个测试项
}

export class Hand {
    is_auto: boolean;
    step_name: string;
    is_ptl: boolean;  // 是否有PTL
    ptl_pos?: string;  // ptl 位置
    left_pdf: string;
    right_pdf: string;
    use_torque: boolean;  // 是否使用力矩杆
    use_count?: string;  // 使用次数
}