<template>
    <div class="text-center code-container">
        <pre class="code">
            <code>
                <div v-for="param in params">{{param}}</div>
            </code>
        </pre>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {mapGetters} from "vuex";

    import { getEventsByName } from '@blockrocket/vue-drizzle-utils';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances']),
            ...mapGetters(['contractName']),
        }
    })
    export default class Parameters extends Vue {
        contractName!: string;
        isDrizzleInitialized!: boolean;
        contractInstances: any;

        get params() {
            if (this.isDrizzleInitialized) {
                const params = getEventsByName(this.contractInstances, this.contractName, 'RoundFinalised')
                    .map((event: any) => event.returnValues._param.toString());

                if (params.length < 21) {
                    for (let i = 0; i < 21 - params.length; i += 1) {
                        params.push('-1');
                    }
                }

                return params;
            }
            return [];
        }
    }
</script>

<style scoped>
    .code {
        background-color: #f5f5f5;
    }

    .code-container {
        width: 300px;
        margin: 0 auto;
    }
</style>
