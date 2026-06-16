import { FootprintInput } from '@/lib/schemas';
import { getCurrencySymbol } from '@/lib/format';

interface ReviewStepProps {
  data: FootprintInput;
}

export function ReviewStep({ data }: ReviewStepProps) {
  const symbol = getCurrencySymbol(data.region);

  const sections = [
    {
      title: 'Geographic region',
      items: [
        { label: 'Region', value: data.region.toUpperCase() },
      ],
    },
    {
      title: 'Transportation',
      items: [
        { label: 'Weekly car travel', value: `${data.carKmPerWeek} km (${data.fuelType})` },
        { label: 'Weekly public transit', value: `${data.publicTransportKm} km` },
        { label: 'Short-haul flights', value: `${data.shortHaulFlights} / year` },
        { label: 'Long-haul flights', value: `${data.longHaulFlights} / year` },
      ],
    },
    {
      title: 'Home energy',
      items: [
        { label: 'Monthly electricity', value: `${data.electricityKwhPerMonth} ${data.region === 'india' ? 'units' : 'kWh'}` },
        { label: 'Heating source', value: `${data.heatingType === 'none' ? 'None' : data.heatingType}` },
        { 
          label: 'Monthly heating qty', 
          value: data.heatingType === 'none' 
            ? '0' 
            : `${data.heatingQtyPerMonth} ${
                data.heatingType === 'natural-gas' || data.heatingType === 'electric'
                  ? (data.region === 'india' ? 'units' : 'kWh')
                  : data.heatingType === 'heating-oil' || data.heatingType === 'lpg'
                  ? 'L'
                  : 'kg'
              }` 
        },
        { label: 'Household size', value: `${data.householdSize} ${data.householdSize === 1 ? 'person' : 'people'}` },
        { label: 'Renewable power offset', value: `${data.renewablePercent}%` },
      ],
    },
    {
      title: 'Diet and food',
      items: [
        { 
          label: 'Dietary choice', 
          value: {
            vegan: 'Vegan',
            vegetarian: 'Vegetarian',
            pescatarian: 'Pescatarian (fish eater)',
            omnivore: 'Average meat eater',
            'high-meat': 'Heavy meat eater',
          }[data.dietType] || data.dietType 
        },
      ],
    },
    {
      title: 'Shopping and spend',
      items: [
        { label: 'Monthly goods spend', value: `${symbol}${data.goodsSpendPerMonth.toLocaleString()}` },
        { label: 'Monthly services spend', value: `${symbol}${data.servicesSpendPerMonth.toLocaleString()}` },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a2e1e]">Review your answers</h2>
        <p className="text-xs text-[#3d5c45] mt-1">
          Please verify your inputs below. You can navigate back to correct any information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map((section, idx) => (
          <div key={idx} className="rounded-xl border border-[#c8e6d0] bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a7a4a] mb-3 border-b border-[#c8e6d0] pb-2">
              {section.title}
            </h3>
            
            <dl className="space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <dt className="text-[#7a9e82] font-medium">{item.label}</dt>
                  <dd className="text-[#3d5c45] font-semibold text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ReviewStep;

