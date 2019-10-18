<template>
    <div class="p-5 no-top-padding">
        <h1 class="text-center mb-3">Twisted Admin</h1>
        <div>
            <h2>Current Round</h2>
            <hr />
            <p><strong>Round #:</strong> {{currentRound}}</p>
            <p><strong>Param From Highest Bidder:</strong> {{highestBidder.param}}</p>
            <p><strong>Highest Bidder:</strong> {{highestBidder.address}}</p>

            <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    class="mb-3"
                    :options="dropzoneOptions"
                    :useCustomSlot="true"
                    @vdropzone-file-added="onFileAdded">
                <div class="dropzone-custom-content">
                    <h4 class="dropzone-custom-title">Drag and drop the winning image</h4>
                    <div class="subtitle">...or click to select a file from your computer</div>
                </div>
            </vue-dropzone>

            <div v-if="!saving">
                <b-button variant="primary"
                          :disabled="!file && !fileBuffer && isDrizzleInitialized"
                          @click="finaliseRound">
                    Finalise
                </b-button>
            </div>
            <div v-else>
                <b-button variant="primary" disabled>
                    <SmallSpinner />
                </b-button>
                <p>Currently {{savingStatus}}</p>
            </div>
        </div>

        <div class="mt-5">
            <h2>All Winning Round Parameters</h2>
            <hr/>
            <div class="text-center code-container">
                <pre class="code">
                    <code>
                        <div v-for="param in params">{{param}}</div>
                    </code>
                </pre>
            </div>
            <p><kbd>-1</kbd> Signifies that a round is yet to be finalised</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { mapGetters } from "vuex";
    import { getEventsByName } from '@blockrocket/vue-drizzle-utils';
    import SmallSpinner from '@/components/SmallSpinner.vue';

    import { Buffer } from 'buffer/';

    // @ts-ignore
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    import ipfsHttpClient from 'ipfs-http-client';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances']),
            ...mapGetters(['contractName']),
        },
        components: {
            SmallSpinner,
            vueDropzone: vue2Dropzone,
        }
    })
    export default class Admin extends Vue {
        contractName!: string;
        isDrizzleInitialized!: boolean;
        drizzleInstance: any;
        contractInstances: any;
        getContractData: any;

        ipfs = ipfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });

        dropzoneOptions: any = {
            url: 'https://',
            thumbnailHeight: 75,
            thumbnailWidth: null,
            autoProcessQueue: false,
            maxFilesize: 10,
            maxFiles: 1,
            minFiles: 1,
        };

        file: any = null;
        fileBuffer: any = null;

        baseIpfsUrl: string = 'https://ipfs.infura.io/ipfs/';

        saving: boolean = false;
        savingStatus: string = '';

        onFileAdded(file: any) {
            this.file = file;

            const reader = new FileReader();

            reader.onloadend = () => {
                // @ts-ignore
                this.fileBuffer = Buffer.from(reader.result);
            };

            reader.readAsArrayBuffer(file);
        }

        async pushBufferToIpfs(buffer: any, tryingToUpload: string): Promise<String> {
            try {
                const results = await this.ipfs.add(buffer, { pin: true });

                if (results && Array.isArray(results) && results.length > 0) {
                    const result = results[0];
                    const hash = result && result.hash ? result.hash : 'unsuccessful';

                    if (hash === 'unsuccessful') {
                        alert(`Failed to upload ${tryingToUpload} to IPFS due to: No hash returned`);
                    }

                    return hash;
                }
            } catch (e) {
                alert(`Failed to upload ${tryingToUpload} to IPFS due to: ${e}`);
            }

            return 'unsuccessful';
        }

        async uploadImageToIpfs(): Promise<string> {
            return (await this.pushBufferToIpfs(this.fileBuffer, 'image')).toString();
        }

        async pushJsonToIpfs(ipfsPayload: any): Promise<string> {
            const buffer = Buffer.from(JSON.stringify(ipfsPayload));
            return (await this.pushBufferToIpfs(buffer, 'token data')).toString();
        }

        getIpfsPayload(imageIpfsUrl: string): any {
            const tokenName = `TWIST Token ${this.currentRound}`;
            return {
                name: tokenName,
                description: tokenName,
                image: imageIpfsUrl,
                attributes: {
                    round_number: this.currentRound,
                    parameter: this.highestBidder.param.toString()
                },
            };
        }

        async finaliseRound() {
            this.saving = true;

            this.savingStatus = 'uploading image to IPFS...';
            const imageIpfsHash = await this.uploadImageToIpfs();
            if(imageIpfsHash === 'unsuccessful') {
                this.saving = false;
                return;
            }

            this.savingStatus = 'uploading JSON to IPFS...';
            const imageIpfsUrl = `${this.baseIpfsUrl}${imageIpfsHash}`;
            const ipfsPayload = this.getIpfsPayload(imageIpfsUrl);
            const ipfsHashForData = await this.pushJsonToIpfs(ipfsPayload);
            if(ipfsHashForData === 'unsuccessful') {
                this.saving = false;
                return;
            }

            this.drizzleInstance
                .contracts[this.contractName]
                .methods['issueTwistAndPrepNextRound']
                .cacheSend(ipfsHashForData);

            this.saving = false;
            // @ts-ignore
            this.$refs.myVueDropzone.removeAllFiles();
        }

        get highestBidder() {
            const noBid = {
                param: 0,
                address: 'No bid address'
            };

            if (this.isDrizzleInitialized) {
                const currentRound = this.currentRound;
                const bidEvents = getEventsByName(this.contractInstances, this.contractName, 'BidAccepted')
                    .filter((event: any) => {
                        return event.returnValues._round === currentRound;
                    }).reverse();

                if (bidEvents.length === 0) return noBid;

                const highestBidderEvent = bidEvents[0];
                return {
                    param: highestBidderEvent.returnValues._param,
                    address: highestBidderEvent.returnValues._bidder
                };
            }
            return noBid;
        }

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

        get currentRound() {
            const round = this.getContractData({
                contract: this.contractName,
                method: 'currentRound'
            });

            if(round !== 'loading') {
                return round;
            }

            return 1;
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

    .no-top-padding {
        padding-top: 0px !important;
    }
</style>
