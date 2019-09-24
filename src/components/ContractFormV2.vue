<template>
    <form v-if="isDrizzleInitialized">
        <input
                v-for="(param, i) in displayInputs"
                v-model="ethData[i]"
                :key="i"
                :type="param.type"
                :placeholder="param.name"
        />
        <button @click.prevent="onSubmit">Submit</button>
    </form>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import { Component, Prop } from 'vue-property-decorator';

    @Component({
        computed: {...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized'])}
    })
    export default class ContractFormV2 extends Vue {
        @Prop({ required: true })
        contractName!: string;

        @Prop({ required: true })
        method!: string;

        @Prop({ default: () => [] })
        methodArgs!: any[];

        @Prop({ default: () => [] })
        placeholders!: string[];

        @Prop({ default: () => 0 })
        value!: number;

        drizzleInstance: any;
        ethData: any = {};

        translateType(type: string): string {
            switch (true) {
                case /^uint/.test(type):
                    return 'number';
                case /^string/.test(type) || /^bytes/.test(type):
                    return 'text';
                case /^bool/.test(type):
                    return 'checkbox';
                default:
                    return 'text';
            }
        }

        onSubmit() {
            const convertedInputs = this.abiInputs.map((input: any, i: number) =>
                input.type === 'bytes32'
                    ? (this.ethData[i] = this.utils.toHex(this.ethData[i]))
                    : this.ethData[i]
            );
            const sendArgs = this.methodArgs.length
                ? [...convertedInputs, this.methodArgs]
                : convertedInputs;

            this.drizzleInstance.contracts[this.contractName].methods[
                this.method
                ].cacheSend(...sendArgs, { value: this.value })
        }

        get abi(): any {
            const di = this.drizzleInstance;
            return di.contracts[this.contractName].abi.find(
                (item: any) => item.name === this.method
            );
        }

        get abiInputs() {
            return this.abi.inputs;
        }

        get displayInputs(): any {
            return this.abi.inputs.map((x: any, i: number) => ({
                name: this.placeholders[i] ? this.placeholders[i] : x.name,
                type: this.translateType(x.type)
            }))
        };

        get utils(): any {
            return this.drizzleInstance.web3.utils;
        }
    }
</script>

<style></style>
