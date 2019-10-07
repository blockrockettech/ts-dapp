<template>
    <div class="text-center">
        <div v-for="param in params">{{param}}</div>
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
                return getEventsByName(this.contractInstances, this.contractName, 'RoundFinalised')
                    .map((event: any) => event.returnValues._param.toString());
            }
            return [];
        }
    }
</script>
