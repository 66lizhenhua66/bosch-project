import { Program } from '../pages/program';

export const PROGRAM: Program = {
    station: 'ST10',
    program_number: 'R111111111',
    detail_program: [
        {
            is_auto: false, step_name: '拿取并扫描标牌', is_ptl: false, 
            left_pdf: '/A10-WI/3609929B45_AD.pdf', right_pdf: '/A10-WI/3609929b82_01.pdf', use_torque: false,
        },
        {
            is_auto: true, step_name: '压机压装并合格自动放行', pro_num: 'press-1-32',
            count: '2', left_pdf: '/A10-WI/DCWI-17143-211_AAW_N_ZH_2018-03-31.pdf', right_pdf: '/A10-WI/3609929B45_AD.pdf',
            stage_name: '阶段名称1', model_number: '', torque: '',
            test_steps: [
                {
                    test_name: '测试项名称1', data_type: 'float',
                    min: '2', max: '5', unit: 'Nm',
                    comparison: '==', precision: '2'
                },
            ]
        
        },
        {
            is_auto: false, step_name: '拿取并扫描标牌', is_ptl: true, ptl_pos: '1',
            left_pdf: '/A10-WI/3609929B45_AD.pdf', right_pdf: '/A10-WI/3609929b82_01.pdf', use_torque: false,
        },
    ]
}