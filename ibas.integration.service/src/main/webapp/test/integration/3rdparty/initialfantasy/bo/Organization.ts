/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    ibas.emYesNo,
    ibas.emDocumentStatus,
    ibas.emBOStatus,
    ibas.emApprovalStatus,
    IBusinessObject,
    IBusinessObjects,
    ibas.I ibas.BOMasterData,
    ibas.I ibas.BOMasterDataLine,
    ibas.I ibas.BODocument,
    ibas.I ibas.BODocumentLine,
    ibas.IBOSimple,
    ibas.IBOSimpleLine
} from "ibas/index";
import {

} from "../Datas";

/** 组织 */
export interface IOrganization extends ibas.I ibas.BOMasterData {

    /** 编码 */
    code: string;

    /** 名称 */
    name: string;

    /** 激活 */
    activated: ibas.emYesNo;

    /** 对象编号 */
    docEntry: number;

    /** 对象类型 */
    objectCode: string;

    /** 创建日期 */
    createDate: Date;

    /** 创建时间 */
    createTime: number;

    /** 修改日期 */
    updateDate: Date;

    /** 修改时间 */
    updateTime: number;

    /** 数据源 */
    dataSource: string;

    /** 实例号（版本） */
    logInst: number;

    /** 服务系列 */
    series: number;

    /** 创建用户 */
    createUserSign: number;

    /** 修改用户 */
    updateUserSign: number;

    /** 创建动作标识 */
    createActionId: string;

    /** 更新动作标识 */
    updateActionId: string;


}
