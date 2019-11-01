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
                          :disabled="!file && !fileBuffer && !auctionData"
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
            <p><kbd>0</kbd> Signifies that a round is yet to be finalised</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { mapGetters } from "vuex";
    import SmallSpinner from '@/components/SmallSpinner.vue';

    import { Buffer } from 'buffer/';
    import {utils} from 'ethers';

    // @ts-ignore
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    import ipfsHttpClient from 'ipfs-http-client';

    @Component({
        computed: {
            ...mapGetters(['auctionData', 'contracts']),
        },
        components: {
            SmallSpinner,
            vueDropzone: vue2Dropzone,
        }
    })
    export default class Admin extends Vue {
        auctionData: any;
        contracts: any;

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
            const {TwistedSisterAuction} = this.contracts;
            if (!TwistedSisterAuction) {
               alert('Contract not yet ready...please try again');
               return;
            }

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
            console.log('ipfsPayload', ipfsPayload);
            const ipfsHashForData = await this.pushJsonToIpfs(ipfsPayload);
            if(ipfsHashForData === 'unsuccessful') {
                this.saving = false;
                return;
            }

            const tx = await TwistedSisterAuction.issueTwistAndPrepNextRound(
                ipfsHashForData,
                {
                    gasLimit: 750000,
                    gasPrice: utils.parseUnits('9.0', 'gwei'),
                }
            );

            let receipt = await tx.wait(1);
            console.log(`Rec: `, receipt);

            this.saving = false;
            // @ts-ignore
            this.$refs.myVueDropzone.removeAllFiles();
        }

        get highestBidder() {
            const noBid = {
                param: 1,
                address: 'No bid address'
            };

            const {highestBidder, paramFromHighestBidder} = this.auctionData.currentRound;
            if (highestBidder && paramFromHighestBidder && paramFromHighestBidder.toString() !== '0') {
                return {
                    param: paramFromHighestBidder,
                    address: highestBidder
                };
            }

            return noBid;
        }

        get params() {
            if (this.auctionData.events.roundFinalised) {
                const events = Object.assign([], this.auctionData.events.roundFinalised).map((e: any) => e._param);
                if(events.length < 21) {
                    for (let i = 0; i < 21 - events.length; i += 1) {
                        events.push('0');
                    }
                }
                return events;
            }
            return [];
        }

        get currentRound() {
            if(this.auctionData.currentRound.roundNumber) {
                return this.auctionData.currentRound.roundNumber.toString();
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
