import { useState } from "react";
import {
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";

export default function SpinWheel() {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState({
    name: "",
    value: "",
    probability: 0.01,
    isExtraChance: false,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const resetNewOption = () =>
    setNewOption({
      name: "",
      value: "",
      probability: 0.01,
      isExtraChance: false,
    });

  const handleAddOption = () => {
    const { name, value, probability } = newOption;

    const parsedProbability = parseFloat(probability);
    if (
      !name.trim() ||
      !value.trim() ||
      isNaN(parsedProbability) ||
      parsedProbability < 0 ||
      parsedProbability > 1
    ) {
      return;
    }

    if (editingIndex !== null) {
      // Update existing option
      const updatedOptions = [...options];
      updatedOptions[editingIndex] = {
        ...newOption,
        probability: parsedProbability,
      };
      setOptions(updatedOptions);
      setEditingIndex(null);
    } else {
      // Add new option
      setOptions([
        ...options,
        { ...newOption, probability: parsedProbability },
      ]);
    }
    resetNewOption();
  };

  const handleRemoveOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      resetNewOption();
    }
  };

  const handleEditOption = (index) => {
    const optionToEdit = options[index];
    setNewOption({
      name: optionToEdit.name,
      value: optionToEdit.value,
      probability: optionToEdit.probability,
      isExtraChance: optionToEdit.isExtraChance,
    });
    setEditingIndex(index);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOption((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "probability" ? value : value,
    }));
  };

  const toggleExtraChance = () => {
    setNewOption((prev) => ({
      ...prev,
      isExtraChance: !prev.isExtraChance,
    }));
  };

  const isAddDisabled =
    !newOption.name.trim() ||
    !newOption.value.trim() ||
    isNaN(parseFloat(newOption.probability)) ||
    parseFloat(newOption.probability) < 0 ||
    parseFloat(newOption.probability) > 1 ||
    (options.length >= 8 && editingIndex === null);

  const saveOptions = async () => {
    if (options.length !== 8 ) {
      toast.error("يرجى إضافة 8 خيارات ");
      return;
    }


    const totalProbability = options.reduce(
      (sum, option) => sum + option.probability,
      0
    );

    if (Math.abs(totalProbability - 1) > 0.0001) {
      toast.error(
        `يجب أن يكون مجموع الاحتمالات 100٪ المجموع الحالي:  ${(
          totalProbability * 100
        ).toFixed(2)}٪.\nيرجى تعديل الخيارات.`
      );
      return;
    }

    try {
      setIsSaving(true);

      const { data } = await api.post("/wheel-rewards", {
        wheelRewards: options,
      });

      toast.success("تم حفظ الخيارات بنجاح!");
    } catch (error) {
      console.error("حدث خطأ أثناء حفظ الخيارات:", error);

      let errorMessage = "فشل في حفظ الخيارات";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage =
          "لا يوجد استجابة من الخادم. يرجى التحقق من الاتصال بالإنترنت.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto bg-white rounded-xoverflow-hidden">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg text-white">
          <h2 className="text-2xl font-bold">اختيارات عجلة الحظ</h2>
          <p className="opacity-90 mt-1">
            أضف وخياراتك لإنشاء عجلة الحظ المخصصة
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-teal-700 flex items-center">
              <span className="w-8 h-8 flex justify-center items-center bg-teal-100 text-teal-800 p-2 rounded-full me-2">
                {options.length}
              </span>
              الخيارات المضافة
            </h3>
            <button
              onClick={saveOptions}
              disabled={options.length === 0 || isSaving}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                options.length === 0 || isSaving
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-teal-600 hover:bg-teal-500 duration-300 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isSaving ? "جاري الحفظ..." : "حفظ الخيارات"}
            </button>
          </div>

          {options.length === 0 ? (
            <div className="text-center py-8 bg-teal-50 rounded-lg">
              <p className="text-teal-600">لا توجد خيارات مضافة بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-teal-100 border border-teal-100 rounded-lg overflow-hidden">
              {options.map((option, index) => (
                <div
                  key={`${option.name}-${option.value}-${index}`}
                  className="flex justify-between items-center p-4 hover:bg-teal-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        option.isExtraChance ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <span className="font-medium text-gray-800">
                        {option.name}
                      </span>
                      <div className="flex space-x-2 text-sm text-gray-600">
                        <span>القيمة: {option.value}</span>
                        <span>|</span>
                        <span>
                          الاحتمال: {(option.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditOption(index)}
                      className="text-teal-400 hover:text-teal-600 p-2 rounded-full hover:bg-teal-50 transition-colors"
                      aria-label="Edit option"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Delete option"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Option Form */}
        <div className="bg-slate-50 p-6 rounded-lg border border-teal-100">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">
            {editingIndex !== null ? "تعديل الخيار" : "إضافة خيار جديد"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">
                الاسم
              </label>
              <input
                type="text"
                name="name"
                value={newOption.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="أدخل اسم الخيار"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">
                القيمة
              </label>
              <input
                type="text"
                name="value"
                value={newOption.value}
                onChange={handleInputChange}
                className="w-full p-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="أدخل قيمة الخيار"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">
                الاحتمال (0 إلى 1)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="probability"
                  step="0.01"
                  min="0"
                  max="1"
                  value={newOption.probability}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-12"
                />
                <span className="absolute right-3 top-3 text-teal-600">
                  {(newOption.probability * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-teal-200">
              <div>
                <label className="text-sm font-medium text-teal-800">
                  فرصة إضافية
                </label>
                <p className="text-xs text-teal-600">
                  {newOption.isExtraChance ? "مفعل" : "غير مفعل"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleExtraChance}
                className="focus:outline-none"
                aria-label="Toggle extra chance"
              >
                {newOption.isExtraChance ? (
                  <FaToggleOn className="text-teal-500 text-3xl" />
                ) : (
                  <FaToggleOff className="text-gray-300 text-3xl" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {editingIndex !== null && (
              <button
                onClick={() => {
                  setEditingIndex(null);
                  resetNewOption();
                }}
                className="flex items-center px-6 py-3 rounded-lg transition-all bg-gray-300 hover:bg-gray-400 text-gray-700 shadow-md hover:shadow-lg mr-3"
              >
                إلغاء
              </button>
            )}
            <button
              onClick={handleAddOption}
              disabled={isAddDisabled}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                isAddDisabled
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <FaPlus className="ml-2" />
              {editingIndex !== null ? "تحديث الخيار" : "إضافة خيار"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
