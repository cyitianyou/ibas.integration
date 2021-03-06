/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace integration {
    export namespace ui {
        export namespace c {
            /**
             * 列表视图-集成任务
             */
            export class IntegrationJobListView extends ibas.BOListView implements app.IIntegrationJobListView {
                /** 返回查询的对象 */
                get queryTarget(): any {
                    return bo.IntegrationJob;
                }
                /** 编辑数据，参数：目标数据 */
                editDataEvent: Function;
                /** 删除数据事件，参数：删除对象集合 */
                deleteDataEvent: Function;
                /** 查看数据 */
                viewDataEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.ui.layout.form.SimpleForm("");
                    this.table = new sap.ui.table.Table("", {
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 15),
                        visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Interactive,
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_integrationjob_objectkey"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "objectKey"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_integrationjob_jobname"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "jobName"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_integrationjob_activated"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "activated",
                                    formatter(data: any): any {
                                        return ibas.enums.describe(ibas.emYesNo, data);
                                    }
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_integrationjob_frequency"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "frequency"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_integrationjob_bocode"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "boCode"
                                })
                            }),
                            /*
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_integrationjob_applicationid"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "applicationId"
                                })
                            }),
                            */
                        ]
                    });
                    this.form.addContent(this.table);
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_new"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://create",
                                    press: function (): void {
                                        that.fireViewEvents(that.newDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_view"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://display",
                                    press: function (): void {
                                        that.fireViewEvents(that.viewDataEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.IntegrationJob>(that.table).firstOrDefault()
                                        );
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_edit"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://edit",
                                    press: function (): void {
                                        that.fireViewEvents(that.editDataEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.IntegrationJob>(that.table).firstOrDefault()
                                        );
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.IntegrationJob>(that.table)
                                        );
                                    }
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://action",
                                    press: function (event: any): void {
                                        ibas.servicesManager.showServices({
                                            proxy: new ibas.BOListServiceProxy({
                                                data: openui5.utils.getSelecteds(that.table),
                                                converter: new bo.DataConverter(),
                                            }),
                                            displayServices(services: ibas.IServiceAgent[]): void {
                                                if (ibas.objects.isNull(services) || services.length === 0) {
                                                    return;
                                                }
                                                let popover: sap.m.Popover = new sap.m.Popover("", {
                                                    showHeader: false,
                                                    placement: sap.m.PlacementType.Bottom,
                                                });
                                                for (let service of services) {
                                                    popover.addContent(new sap.m.Button({
                                                        text: ibas.i18n.prop(service.name),
                                                        type: sap.m.ButtonType.Transparent,
                                                        icon: service.icon,
                                                        press: function (): void {
                                                            service.run();
                                                            popover.close();
                                                        }
                                                    }));
                                                }
                                                (<any>popover).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                                                popover.openBy(event.getSource(), true);
                                            }
                                        });
                                    }
                                })
                            ]
                        }),
                        content: [this.form]
                    });
                    this.id = this.page.getId();
                    // 添加列表自动查询事件
                    openui5.utils.triggerNextResults({
                        listener: this.table,
                        next(data: any): void {
                            if (ibas.objects.isNull(that.lastCriteria)) {
                                return;
                            }
                            let criteria: ibas.ICriteria = that.lastCriteria.next(data);
                            if (ibas.objects.isNull(criteria)) {
                                return;
                            }
                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                            that.fireViewEvents(that.fetchDataEvent, criteria);
                        }
                    });
                    return this.page;
                }
                private page: sap.m.Page;
                private form: sap.ui.layout.form.SimpleForm;
                private table: sap.ui.table.Table;
                /** 显示数据 */
                showData(datas: bo.IntegrationJob[]): void {
                    let done: boolean = false;
                    let model: sap.ui.model.Model = this.table.getModel(undefined);
                    if (!ibas.objects.isNull(model)) {
                        // 已存在绑定数据，添加新的
                        let hDatas: any = (<any>model).getData();
                        if (!ibas.objects.isNull(hDatas) && hDatas.rows instanceof Array) {
                            for (let item of datas) {
                                hDatas.rows.push(item);
                            }
                            model.refresh(false);
                            done = true;
                        }
                    }
                    if (!done) {
                        // 没有显示数据
                        this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    }
                    this.table.setBusy(false);
                }

                /** 记录上次查询条件，表格滚动时自动触发 */
                query(criteria: ibas.ICriteria): void {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.table.setBusy(true);
                        this.table.setFirstVisibleRow(0);
                        this.table.setModel(null);
                    }
                }
            }
        }
    }
}