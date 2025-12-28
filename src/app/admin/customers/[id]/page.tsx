'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Euro, FileText, Briefcase, ShoppingBag, Edit, Trash2, Plus, X } from 'lucide-react'

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  joinedDate: string
  status: 'active' | 'inactive'
}

interface ProjectRequest {
  id: string
  type: string
  budget: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  submittedDate: string
}

interface License {
  id: string
  packageName: string
  domain: string
  status: 'active' | 'expired' | 'revoked'
  purchaseDate: string
  expiryDate: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paymentDate: string
}

interface SupportPackage {
  id: string
  name: string
  price: string
  purchaseDate: string
  renewalDate: string
  status: 'active' | 'expired'
}

interface Purchase {
  id: string
  itemName: string
  category: string
  price: string
  purchaseDate: string
  downloadLink?: string
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'projects' | 'licenses' | 'invoices' | 'support_packages' | 'marketplace'>('projects')

  // Mock data - in real app, fetch from API
  const customer: CustomerDetail = {
    id: params.id || '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    company: 'Yılmaz A.Ş.',
    address: 'İstanbul, Turkey',
    joinedDate: '2024-01-15',
    status: 'active',
  }

  const [projects, setProjects] = useState<ProjectRequest[]>([
    {
      id: '1',
      type: 'E-commerce Platform',
      budget: '75,000 - 100,000 €',
      status: 'completed',
      submittedDate: '2024-11-20',
    },
    {
      id: '2',
      type: 'Corporate Website',
      budget: '45,000 - 60,000 €',
      status: 'in_progress',
      submittedDate: '2024-12-05',
    },
  ])

  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      packageName: 'E-commerce V1 + SEO Module',
      domain: 'sitem.com',
      status: 'active',
      purchaseDate: '2024-06-15',
      expiryDate: '2025-06-15',
    },
    {
      id: '2',
      packageName: 'Blog Module',
      domain: 'sitem.com',
      status: 'active',
      purchaseDate: '2024-08-20',
      expiryDate: '2025-08-20',
    },
  ])

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      amount: '2,988 €',
      status: 'paid',
      dueDate: '2024-12-25',
      paymentDate: '2024-12-24',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      amount: '5,988 €',
      status: 'paid',
      dueDate: '2024-11-25',
      paymentDate: '2024-11-23',
    },
  ])

  const [supportPackages, setSupportPackages] = useState<SupportPackage[]>([
    {
      id: '1',
      name: 'Standard Package',
      price: '299 €/month',
      purchaseDate: '2024-09-15',
      renewalDate: '2025-09-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Professional Package',
      price: '599 €/month',
      purchaseDate: '2024-10-20',
      renewalDate: '2025-10-20',
      status: 'active',
    },
  ])

  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      itemName: 'E-commerce V1 Template',
      category: 'Template',
      price: '499 €',
      purchaseDate: '2024-11-20',
      downloadLink: '/downloads/ecommerce-v1.zip',
    },
    {
      id: '2',
      itemName: 'Standard Support Package',
      category: 'Support Package',
      price: '299 €',
      purchaseDate: '2024-09-15',
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/customers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{customer.name}</CardTitle>
              <CardDescription>{customer.company}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {customer.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined: {customer.joinedDate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">Total Value</div>
              <div className="text-2xl font-bold">18,966 €</div>
              <div className="text-sm text-muted-foreground">Lifetime spending</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">Quick Actions</div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { key: 'projects', label: 'My Projects', icon: Briefcase },
                { key: 'licenses', label: 'My Licenses', icon: FileText },
                { key: 'invoices', label: 'My Invoices', icon: Euro },
                { key: 'support_packages', label: 'Support Packages', icon: ShoppingBag },
                { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 min-w-max px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Projects</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No project requests found
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Type</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.type}</TableCell>
                            <TableCell>{project.budget}</TableCell>
                            <TableCell>{project.submittedDate}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  project.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : project.status === 'in_progress'
                                      ? 'bg-blue-100 text-blue-800'
                                      : project.status === 'approved'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {project.status === 'completed' && 'Completed'}
                                {project.status === 'in_progress' && 'In Progress'}
                                {project.status === 'approved' && 'Approved'}
                                {project.status === 'rejected' && 'Rejected'}
                                {project.status === 'pending' && 'Pending'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'licenses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Licenses</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add License
                  </Button>
                </div>

                {licenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No licenses found
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Package Name</TableHead>
                          <TableHead>Domain</TableHead>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {licenses.map((license) => (
                          <TableRow key={license.id}>
                            <TableCell className="font-medium">{license.packageName}</TableCell>
                            <TableCell className="font-mono text-sm">{license.domain}</TableCell>
                            <TableCell>{license.purchaseDate}</TableCell>
                            <TableCell>{license.expiryDate}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  license.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : license.status === 'expired'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {license.status === 'active' && 'Active'}
                                {license.status === 'expired' && 'Expired'}
                                {license.status === 'revoked' && 'Revoked'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Invoices</h3>
                </div>

                {invoices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                            <TableCell className="font-medium">{invoice.amount}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{invoice.paymentDate}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  invoice.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : invoice.status === 'overdue'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {invoice.status === 'paid' && 'Paid'}
                                {invoice.status === 'pending' && 'Pending'}
                                {invoice.status === 'overdue' && 'Overdue'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'support_packages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Support Packages</h3>
                </div>

                {supportPackages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No support packages found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {supportPackages.map((pkg) => (
                      <Card key={pkg.id}>
                        <CardHeader>
                          <CardTitle>{pkg.name}</CardTitle>
                          <CardDescription>{pkg.price}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Purchased: {pkg.purchaseDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Renewal: {pkg.renewalDate}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t">
                            <Button className="w-full" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Marketplace</h3>
                </div>

                {purchases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No purchases found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {purchases.map((purchase) => (
                      <Card key={purchase.id} className="overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{purchase.itemName}</CardTitle>
                              <CardDescription>{purchase.category}</CardDescription>
                            </div>
                            <div className="text-sm font-medium">{purchase.price}</div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Purchased: {purchase.purchaseDate}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t">
                            <Button
                              className="w-full"
                              disabled={!purchase.downloadLink}
                            >
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
