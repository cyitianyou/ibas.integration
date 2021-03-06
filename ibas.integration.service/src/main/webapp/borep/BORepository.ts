/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace integration {
    export namespace bo {

        /** 业务对象仓库 */
        export class BORepositoryIntegration extends ibas.BORepositoryApplication implements IBORepositoryIntegration {

            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter {
                return new DataConverter;
            }

            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.upload("upload", caller);
            }
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryDownloadAjax = new ibas.FileRepositoryDownloadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("download", caller);
            }
            /**
             * 查询 集成任务
             * @param fetcher 查询者
             */
            fetchIntegrationJob(fetcher: ibas.IFetchCaller<bo.IntegrationJob>): void {
                super.fetch(bo.IntegrationJob.name, fetcher);
            }
            /**
             * 保存 集成任务
             * @param saver 保存者
             */
            saveIntegrationJob(saver: ibas.ISaveCaller<bo.IntegrationJob>): void {
                super.save(bo.IntegrationJob.name, saver);
            }
            /**
             * 查询 集成动作
             * @param fetcher 查询者
             */
            fetchAction(fetcher: ibas.IFetchCaller<bo.Action>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let boRepository: ibas.BORepositoryAjax = new ibas.BORepositoryAjax();
                boRepository.address = this.address.replace("/services/rest/data/", "/services/rest/action/");
                boRepository.token = this.token;
                boRepository.converter = this.createConverter();
                boRepository.fetch(bo.Action.name, fetcher);
            }
            /**
             * 删除 集成动作
             * @param fetcher 查询者
             */
            deleteActionPackage(deleter: IPackageDeleter): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let boRepository: ibas.BORepositoryAjax = new ibas.BORepositoryAjax();
                boRepository.address = this.address.replace("/services/rest/data/", "/services/rest/action/");
                boRepository.token = this.token;
                boRepository.converter = this.createConverter();
                let method: string = ibas.strings.format("deletePackage?group={0}&token={1}", deleter.beDeleted, this.token);
                boRepository.callRemoteMethod(method, undefined, deleter);
            }
            /**
             * 上传程序包
             * @param caller 调用者
             */
            uploadActionPackage(caller: ibas.IUploadFileCaller<bo.Action>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/action/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.upload("uploadPackage", caller);
            }
            /**
             * 获取动作地址
             */
            toUrl(action: bo.Action): string {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let url: string = this.address.replace("/services/rest/data/", "/services/rest/action/");
                url += ibas.strings.format("{0}?token={1}", action.fullPath(), this.token);
                return encodeURI(url);
            }
            /**
             * 获取动作地址
             */
            toPackageUrl(action: bo.Action): string {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let url: string = this.address.replace("/services/rest/data/", "/services/rest/action/");
                if (ibas.objects.isNull(action.group)) {
                    return encodeURI(url);
                } else if (action.group.startsWith("http")) {
                    return encodeURI(action.group);
                }
                return encodeURI(url + action.group);
            }
            /**
             * 下载代码文件
             * @param caller 调用者
             */
            downloadCode(caller: ICodeDownloader<Blob>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: CodeRepositoryDownloadAjax = new CodeRepositoryDownloadAjax();
                fileRepository.address = this.toUrl(caller.action);
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("", caller);
            }
        }
        /** 代码下载者 */
        export interface ICodeDownloader<T> extends ibas.IMethodCaller<T> {
            /** 标识 */
            action: bo.Action;
        }
        /** 包删除者 */
        export interface IPackageDeleter extends ibas.IMethodCaller<any> {
            /** 被删除 */
            beDeleted: string;
        }
        /** 代码下载仓库 */
        export class CodeRepositoryDownloadAjax extends ibas.RemoteRepositoryXhr {
            constructor() {
                super();
                this.autoParsing = false;
            }
            /**
             * 下载文件
             * @param method 方法地址
             * @param caller 调用者
             */
            download<T>(method: string, caller: ibas.IMethodCaller<any>): void {
                let methodCaller: ibas.IMethodCaller<any> = {
                    onCompleted(data: any): void {
                        let opRslt: ibas.IOperationResult<any> = null;
                        if (data instanceof ibas.OperationResult) {
                            opRslt = data;
                        } else {
                            opRslt = new ibas.OperationResult();
                            opRslt.resultObjects.add(data);
                        }
                        caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                    }
                };
                this.callRemoteMethod(method, undefined, methodCaller);
            }
            protected createHttpRequest(method: string, data: any): XMLHttpRequest {
                let methodUrl: string = this.methodUrl(method);
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.open("GET", methodUrl, true);
                xhr.responseType = "blob";
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                return xhr;
            }
        }

        /** 业务对象仓库-集成开发 */
        export class BORepositoryIntegrationDevelopment extends ibas.BORepositoryApplication {
            constructor() {
                super();
                // 重置状态
                this.offline = true;
                this.address = "";
                this.token = "";
            }
            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter {
                return new DataConverter;
            }
            /**
             * 读取 集成动作
             * @param fetcher 读取者
             */
            loadActions(loader: IActionsLoader): void {
                let boRepository: ibas.BOFileRepositoryAjax = new ibas.BOFileRepositoryAjax();
                boRepository.address = this.address;
                boRepository.token = this.token;
                boRepository.autoParsing = true;
                boRepository.converter = this.createConverter();
                boRepository.load(loader.url, loader);
            }
        }
        /** 动作读取者 */
        export interface IActionsLoader extends ibas.IMethodCaller<bo.Action> {
            /** 地址 */
            url: string;
        }
    }
}