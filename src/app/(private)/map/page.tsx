'use client'

import IncidentsMap from '@/components/IncidentsMap'
import { Incident } from '@/types/incident'

const MOCK_INCIDENTS: Incident[] = [
  // Deprem kaynaklı acil durumlar
  {
    id: '1',
    lat: 35.1856,
    lng: 33.3823,
    type: 'MEDICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    message:
      'Deprem sonrası enkaz altında kalan aile. 3. kat balkonunda mahsur kalmış 2 kişi görüldü.',
  },
  {
    id: '2',
    lat: 35.19,
    lng: 33.37,
    type: 'MEDICAL',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    message: 'Çöken binanın altında sesler duyuluyor. En az 4 kişi mahsur.',
  },
  {
    id: '3',
    lat: 35.175,
    lng: 33.39,
    type: 'FIRE',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    message: 'Deprem sonrası gaz kaçağından patlama. Bina yanıyor.',
  },
  // Sel kaynaklı acil durumlar
  {
    id: '4',
    lat: 35.3364,
    lng: 33.3181,
    type: 'MEDICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    message:
      'Sel suları yükseliyor. 3. katta mahsur kalan yaşlı çift kurtarılmayı bekliyor.',
  },
  {
    id: '5',
    lat: 35.33,
    lng: 33.31,
    type: 'MEDICAL',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    message: 'Araç sel sularına kapıldı. İçinde 3 kişi var.',
  },
  {
    id: '6',
    lat: 35.325,
    lng: 33.325,
    type: 'FIRE',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    message: 'Sel nedeniyle elektrik kontağı. Bodrum katta yangın.',
  },
  // Gazimağusa bölgesi
  {
    id: '7',
    lat: 35.1264,
    lng: 33.93,
    type: 'MEDICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    message: 'Depremde çöken okul binası. Öğrenciler enkaz altında.',
  },
  {
    id: '8',
    lat: 35.13,
    lng: 33.92,
    type: 'MEDICAL',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    message: 'Hastane tahliye ediliyor. Yoğun bakım hastaları nakil bekliyor.',
  },
  // Güzelyurt bölgesi
  {
    id: '9',
    lat: 35.2,
    lng: 33.0,
    type: 'MEDICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    message:
      'Sel suları tarım arazilerini bastı. Çiftlik evinde mahsur kalan aile.',
  },
  {
    id: '10',
    lat: 35.21,
    lng: 33.02,
    type: 'FIRE',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    message: 'Sel sonrası jeneratör patlaması. Yangın yayılıyor.',
  },
  // Diğer bölgeler
  {
    id: '11',
    lat: 35.28,
    lng: 33.5,
    type: 'MEDICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    message: 'Köprü çöktü. Araçlar nehre düştü. Acil kurtarma gerekli.',
  },
  {
    id: '12',
    lat: 35.35,
    lng: 33.9,
    type: 'MEDICAL',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    message: 'Deprem kaynaklı heyelan. Yol kapandı, araçlar mahsur.',
  },
  {
    id: '13',
    lat: 35.17,
    lng: 33.45,
    type: 'FIRE',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    message: 'Apartman bloğunda gaz patlaması. Üst katlar yanıyor.',
  },
  {
    id: '14',
    lat: 35.22,
    lng: 33.35,
    type: 'MEDICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    message: 'Yarı yıkık binada 4. katta el sallayan kişi görüldü.',
  },
  {
    id: '15',
    lat: 35.14,
    lng: 33.85,
    type: 'MEDICAL',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    message: 'Sel sularından kaçan aile çatıda mahsur kaldı.',
  },
]

const Page = (): JSX.Element => {
  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <IncidentsMap incidents={MOCK_INCIDENTS} />
    </div>
  )
}
export default Page
