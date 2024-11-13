"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStatsService = void 0;
const base_service_1 = require("../base-service");
const data_model_1 = require("../../../ts-schema/data.model");
const constants_1 = require("../../../ts-schema/constants");
class SystemStatsService extends base_service_1.BaseService {
    constructor(eventBus) {
        super(eventBus, {
            serviceCode: constants_1.ServiceCode.SystemStats,
            serviceType: constants_1.ServiceType.OnDemand,
            broadcastMode: constants_1.BroadcastMode.OnDemandPolling,
        });
        this.data = new data_model_1.SystemStatsData();
    }
    setup() {
        super.setup();
        this.data.arch = process.arch;
        this.data.platform = process.platform;
        this.data.version = process.version;
        this.data.name = board.name;
        this.data.uid = board.uid;
    }
    publishData() {
        const mem = process.memoryUsage();
        this.data.heapTotal = mem.heapTotal;
        this.data.heapUsed = mem.heapUsed;
        this.data.heapPeak = mem.heapPeak;
        super.publishData();
    }
}
exports.SystemStatsService = SystemStatsService;
