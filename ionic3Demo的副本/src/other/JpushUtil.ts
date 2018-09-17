/**
 *消息推送处理
 *参考来源：https://github.com/jpush/jpush-phonegap-plugin
 * @weijb
 */
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { Header } from 'ionic-angular/components/toolbar/toolbar-header';
import { Common } from '../lib/Common'
import { TTConst } from '../lib/TTConst';
import { Emitter } from '../other/emitter'
/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class JpushUtil {
    private registrationId: string;
    sequence: number = 0;
    constructor(private ttConst : TTConst, private jpush: JPush, private platform: Platform,
        private common: Common) {

    }

    initPush() {
        /**接收消息触发 */
        document.addEventListener('jpush.receiveNotification', (event: any) => {
            this.common.deviceid = event['extras']['Device_id'];
            Emitter.fire(this.ttConst.TT_CLLPHONE_NOTIFICATION_NAME, this.common.deviceid);

        }, false);
        /**打开消息触发 */
        document.addEventListener('jpush.openNotification', (event: any) => {
            this.common.deviceid = event['extras']['Device_id'];
            Emitter.fire(this.ttConst.TT_CLLPHONE_NOTIFICATION_NAME, this.common.deviceid);
        }, false);
        /**接收本地消息 */
        document.addEventListener('jpush.receiveLocalNotification', (event: any) => {
            this.common.deviceid = event['extras']['Device_id'];
            Emitter.fire(this.ttConst.TT_CLLPHONE_NOTIFICATION_NAME, this.common.deviceid);
        }, false);
    }

    tagResultHandler = function (result) {
        var sequence: number = result.sequence;
        var tags: Array<string> = result.tags == null ? [] : result.tags;
        this.logger.log('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString(), '标签设置回调');
    };

    aliasResultHandler = function (result) {
        var sequence: number = result.sequence;
        var alias: string = result.alias;
        this.logger.log('Success!' + '\nSequence: ' + sequence + '\nAlias: ' + alias, '别名设置回调');
    };

    errorHandler = function (err) {
        var sequence: number = err.sequence;
        var code = err.code;
        //console.log('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code,'异常设置回调');
        //this.logger.log('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code,'异常设置回调');
    };
    /**
     * 设备的id
     */
    getRegistrationID() {
        this.jpush.getRegistrationID()
            .then(rId => {
                this.registrationId = rId;
            });
    }
    /**
     * 设置标签
     * tags:['Tag1', 'Tag2']
     */
    setTags(tags: Array<string>) {
        this.jpush.setTags({ sequence: this.sequence++, tags: tags })
            .then(this.tagResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 添加标签
     * tags:['Tag3', 'Tag4']
     */
    addTags(tags: Array<string>) {
        this.jpush.addTags({ sequence: this.sequence++, tags: tags })
            .then(this.tagResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 检测标签状态
     * * @param tag
     */
    checkTagBindState(tag: string) {
        this.jpush.checkTagBindState({ sequence: this.sequence++, tag: tag })
            .then(result => {
                var sequence = result.sequence;
                var tag = result.tag;
                var isBind = result.isBind;
            }).catch(this.errorHandler);
    }
    /**
     * 
     * @param tag 删除标签
     */
    deleteTags(tag: Array<string>) {
        this.jpush.deleteTags({ sequence: this.sequence++, tags: tag })
            .then(this.tagResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 
     * 获取所有标签
     */
    getAllTags() {
        this.jpush.getAllTags({ sequence: this.sequence++ })
            .then(this.tagResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 
     *清空所有标签
     */
    cleanTags() {
        this.jpush.cleanTags({ sequence: this.sequence++ })
            .then(this.tagResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 
     * @param alias 设置别名
     */
    setAlias(alias: string) {
        this.jpush.setAlias({ sequence: this.sequence ? this.sequence++ : 1, alias: alias })
            .then(this.aliasResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 
     * 获取所有别名
     */
    getAlias() {
        this.jpush.getAlias({ sequence: this.sequence++ })
            .then(this.aliasResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 
     * 删除所有别名
     */
    deleteAlias() {
        this.jpush.deleteAlias({ sequence: this.sequence++ })
            .then(this.aliasResultHandler)
            .catch(this.errorHandler);
    }
    /**
     * 添加本地消息
     */
    addLocalNotification() {
        if (this.platform.is('ios')) {
            this.jpush.addLocalNotificationForIOS(5, 'Hello JPush', 1, 'localNoti1');
        } else if (this.platform.is('android')) {
            this.jpush.addLocalNotification(0, 'Hello JPush', 'JPush', 1, 5000);
        }
    }

}
